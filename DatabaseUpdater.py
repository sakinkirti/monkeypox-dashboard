import psycopg2
import sys
import os

from DatasetCleaner import DatasetCleaner as DC

"""
authors: Saketh Dendi, Felix Huang, and Sakin Kirti
since: 10/13/2022  

The DatabaseUpdater gets called from the DatabaseSyncher. It updates the local database, populating
it with values from the udpated Global.Health source.
"""

class DatabaseUpdater:
    """
    class to connect to the monkeypox db
    """

    def __init__(self) -> None:
        """
        the init method which specifies the variables to connect to the db
        """

        # specify db connection variables
        self.endpoint = "monkeypox-db.cjmhlqzkirpm.us-east-1.rds.amazonaws.com"
        self.port = "5432"
        self.region = "us-east-1c"
        self.dbname = "monkeypox-db"

        # user and pass to connect
        self.user = "monkeypox-admin"
        self.token = "dashboard123"

        # store the db connection
        self.conn

        # store the new data to update
        self.new_data
        self.tables = ["confirmed_counts", "ph_stats"]

    def db_connect(self):
        """
        method to connect to the db based on the instance vars
        from the init method
        """

        # make the connection to the db
        try:
            self.conn = psycopg2.connect(host=self.endpoint, port=self.port, database=self.dbname, user=self.user, password=self.token)
        except Exception as e:
            print("Database connection failed due to: {}".format(e))

    def db_disconnect(self):
        """
        method to disconnect from the db once any actions to complete are done
        """

        # close the db connection
        try:
            self.conn.close()
        except Exception as e:
            print("Database connection failed due to: {}".format(e))

    def get_globalhealth_data(self):
        """
        method to get the cleaned global health data
        """

        # generate the cleaner object
        cleaner = DC(data="https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest.csv")

        # clean the data and calcualte ph stats
        cleaner.wrangle()
        cleaner.generate_ph_stats()

        # generate predictions
        cleaner.predict_cases()
        cleaner.predict_ph_stats()

        # store the data
        self.new_data = cleaner.retrieve_cleaned_data()

    def db_update(self):
        """
        method to update the database
        """

        # generate the cursor
        cursor = self.conn.cursor()

        # first clear the tables
        cursor.execute("DELETE from case_counts")
        cursor.execute("DELETE from ph_stats")

        # write the new tables using the 'fill_table' helper method
        for df, table in zip(self.new_data, self.tables):
            self.fill_table(df, table, cursor)

    def fill_table(self, df, table, cursor):
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
            psycopg2.extras.execute_values(cursor, query, tuples)
            self.conn.commit()
        except (Exception, psycopg2.DatabaseError) as error:
            print("Error: %s" % error)
            self.conn.rollback()
