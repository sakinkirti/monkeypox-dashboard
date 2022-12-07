import psycopg2
from psycopg2 import extras
import pandas as pd
import numpy as np
from DatasetCleaner import DatasetCleaner as DC
from scipy.stats import linregress


class DatabaseUpdater:
    """
    authors: Sakin Kirti, Saketh Dendi, and Felix Huang
    since: 10/13/2022  

    The DatabaseUpdater gets called from the DatabaseSyncher. It updates the local database, populating
    it with values from the udpated Global.Health and CDC source.
    """

    def __init__(self, db_reset: bool=False):
        """
        the init method which specifies the variables to connect to the db
        """

        # specify db connection variables
        self.endpoint = "monkeypox-db.cjmhlqzkirpm.us-east-1.rds.amazonaws.com"
        self.port = "5432"
        self.region = "us-east-1c"
        self.dbname = "postgres"

        # user and pass to connect
        self.user = "monkeypox_admin"
        self.token = "dashboard123"

        # store the new data to update
        self.tables = ["confirmed_counts", "ph_stats"]
        self.new_data = None

        # to know if we need to fully reset the database or just add the new values
        self.reset = db_reset

    def db_connect(self):
        """
        method to connect to the db based on the instance vars
        from the init method
        """

        # make the connection to the db
        return psycopg2.connect(
            database=self.dbname,
            user=self.user, 
            password=self.token,
            host=self.endpoint, 
            port=self.port)

    def db_disconnect(self, connection):
        """
        method to disconnect from the db once any actions to complete are done
        """

        # close the db connection
        connection.close()

    def get_data(self):
        """
        method to get the cleaned global health data
        """

        # generate the cleaner object
        cleaner = DC(state_totals="https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts/exported_files/usmap_counts.csv",
                     globalhealth_data="https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest_deprecated.csv",
                     full_update=self.reset)

        # clean the data and calcualte ph stats
        cleaner.generate_ph_stats()

        # store the data
        cleaner.set_cleaned_data()
        self.new_data = cleaner.retrieve_cleaned_data()

    def db_retrieve(self, table):
        """
        method to retrieve the data present in the database
        """

        # connect to the db and generate cursor
        conn = self.db_connect()
        cursor = conn.cursor()

        # execute select statement to get all the data from the specified table
        cursor.execute(f"SELECT * from {table}")
        result = cursor.fetchall()

        # close the connection
        conn.close()

        # return the result
        return result

    def db_update(self):
        """
        ** ONLY USED FOR FULL RESETS, DON'T USE OTHERWISE **
        method to update the database

        params
        data: pd.DataFrame - the data to add to the table
        table: str - the name of the PostgreSQL table to fill
        """

        # connect to db generate the cursor
        conn = self.db_connect()
        cursor = conn.cursor()
        # first clear the tables
        cursor.execute("DELETE from case_counts")
        cursor.execute("DELETE from ph_stats")

        # fill both tables
        for df, table in zip(self.new_data, self.tables):
            self.fill_table(df, table, conn, cursor)


        self.db_disconnect(conn)

    def fill_table(self, df, table, connection, cursor):
        """
        general helper method to update each specific table

        params
        df: pd.DataFrame - the dataframe to fill a table with
        table: str - the name of the table to populate
        cursor: psycopg2.connection.cursor - the cursor to execute the commands with
        """
        if table == "prediction":
            cursor.execute("DELETE from predictions")


        # data to insertable format
        tuples = [tuple(x) for x in df.to_numpy()]
        cols = ','.join(list(df.columns))

        # SQL query to execute
        query = "INSERT INTO %s(%s) VALUES %%s" % (table, cols)

        # execute
        try:
            extras.execute_values(cursor, query, tuples)
            connection.commit()
        except (Exception, psycopg2.DatabaseError) as error:
            print("Error: %s" % error)
            connection.rollback()

    def cumulative_stats(self):
        """
        method to find the cumulative case count and rename dataframe values
        """

        # initialize
        old_df = pd.DataFrame(self.db_retrieve(table="case_counts"))

        # formatting
        old_df.rename(columns={0:"confirmed_date", 1: "state_name", 2:"num_cases", 3: "is_predicted"}, inplace = True)
        old_df = old_df.sort_values(by=["state_name", "confirmed_date"])

        # cumulative stats
        # old_df["num_cases"] = old_df["num_cases"].cumsum()
        old_df['num_cases'] = old_df.groupby('state_name')['num_cases'].cumsum()
        #old_df = old_df.iloc[:-2,:]
        #print(old_df.tail(50))
        return old_df

    def prediction_engine(self):
        """
        method to predict case counts for next two weeks
        """
        
        # initialize
        predDf = self.cumulative_stats()
        states=["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
                "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
                "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
                "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
        stateDf = pd.DataFrame()
        for state in states:
            newDf = predDf[(predDf['state_name'] == state)]

            # formatting
            increases = newDf['num_cases'].to_numpy()
            linear = np.arange(0, increases.size)

            # predictions
            preDate = []
            newDf['is_predicted'] = newDf['num_cases'].rolling(14).apply(lambda s: linregress(s.reset_index())[0])

            for value in range(1, 15):
                preDate.append(value)

            df = newDf['is_predicted'].iloc[-14:]
            tempDf = pd.DataFrame({'date': preDate, 'state': newDf.iloc[1]['state_name'],'num_cases': df})
            stateDf = pd.concat([stateDf, tempDf])
        print(stateDf)
        # update db
        conn = self.db_connect()
        cursor = conn.cursor()
        cursor.execute("DELETE from predictions")
        self.fill_table(stateDf, "predictions", conn, cursor)
        self.db_disconnect(conn)

    def slope_numpy(x,y):
        fit = np.polyfit(x, y, 1)
        return np.poly1d(fit)[0]
