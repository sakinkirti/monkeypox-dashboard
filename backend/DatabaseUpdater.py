import psycopg2
from psycopg2 import extras

from DatasetCleaner import DatasetCleaner as DC

class DatabaseUpdater:
    """
    authors: Saketh Dendi, Felix Huang, and Sakin Kirti
    since: 10/13/2022  

    The DatabaseUpdater gets called from the DatabaseSyncher. It updates the local database, populating
    it with values from the udpated Global.Health source.
    """

    def __init__(self):
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
        self.new_data = None
        self.tables = ["confirmed_counts", "ph_stats"]

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

    def get_globalhealth_data(self):
        """
        method to get the cleaned global health data
        """

        # generate the cleaner object
        cleaner = DC(data="https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest.csv")

        # clean the data and calcualte ph stats
        cleaner.wrangle()
        # cleaner.generate_ph_stats()

        # generate predictions
        #cleaner.predict_cases()
        #cleaner.predict_ph_stats()

        # store the data
        self.new_data = cleaner.retrieve_cleaned_data()

    def db_update(self, data=None, table=None):
        """
        method to update the database
        """

        # connect to db generate the cursor
        conn = self.db_connect()
        cursor = conn.cursor()

        if data is not None and table is not None:
            # clear the specified table
            cursor.execute(f"DELETE from {table}")

            # fill the table
            self.fill_table(data, table, conn, cursor)
        elif data is None and table is None:
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

        params:
        df: pd.DataFrame - the dataframe to fill a table with
        table: str - the name of the table to populate
        cursor: psycopg2.connection.cursor - the cursor to execute the commands with
        """

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