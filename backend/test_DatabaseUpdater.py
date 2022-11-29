from unittest import TestCase
import pandas as pd

from DatabaseUpdater import DatabaseUpdater as DU

class test_DatabaseUpdater(TestCase):
    """
    author: Sakin Kirti
    date: 10/19/2022

    class to test the methods in DatabaseUpdater
    
    superclass: unittest.TestCase
    """

    def test_db_connect(self):
        """
        method to test the if the db connection method works

        connect and disconnect get tested together to make sure that 
        the connection closes and isn't left open unsafely
        """

        # initialize the udpater
        updater = DU()

        # test the connect
        conn = updater.db_connect()
        self.assertTrue(False if conn is Exception else True)
        updater.db_disconnect(conn)

    def test_db_disconnect(self):
        """
        method to test the disconnection from the database
        """

        # initialize
        updater = DU()

        # test disconnect
        conn = updater.db_connect()
        self.assertTrue(updater.db_disconnect(conn) != Exception)

    def test_get_data(self):
        """
        method to test the cleaning and generation of 
        the public health data
        """

        # initialize the object
        updater = DU()
        updater.get_data()

        # make sure there is something in the storage
        self.assertTrue(updater.new_data is not None)

        # check the format of data
        self.assertTrue(type(updater.new_data) == list)
        self.assertEqual(len(updater.new_data), 2, "new_data should only have 2 dataframes")
        self.assertTrue(type(updater.new_data[0]) == pd.DataFrame)
        self.assertTrue(type(updater.new_data[1]) == pd.DataFrame)

    def test_fill_table(self):
        """
        test the method to update the database
        """

        # create some dummy data to add to the db
        dummy_data = {"confirmed_date": ["10-19-2022", "10-19-2022", "10-19-2022"], 
                    "state_name": ["California", "Massachusetts", "Kansas"],
                    "num_cases": [10, 35, 3],
                    "is_predicted": [0, 0, 0]}
        dummy_df = pd.DataFrame(dummy_data)

        # open a connection to the db and update
        updater = DU()
        conn = updater.db_connect()
        cursor = conn.cursor()

        # remove everything from the test table
        cursor.execute("DELETE FROM test_table")
        updater.fill_table(dummy_df, "test_table", conn, cursor)
        updater.db_disconnect(conn)

        # get the test table and run some tests
        test_df = pd.DataFrame(updater.db_retrieve(table="test_table"))
        test_df.rename(columns={0: "confirmed_date", 1: "state_name", 2: "num_cases", 3: "is_predicted"}, inplace=True)

        # make sure the right table was updated
        self.assertEqual(test_df.columns.tolist(), ["confirmed_date", "state_name", "num_cases", "is_predicted"], "incorrect columns detected")
        self.assertEqual(test_df.shape, (3, 4), "table shape is not correct")

    def test_db_retrieve(self):
        """
        method to test the db_retrieve method in DatabaseUpdater
        """

        # initialize
        updater = DU()

        # retrieve data
        table = pd.DataFrame(updater.db_retrieve(table="test_table"))

        # check to make sure its the right table
        self.assertEqual(table.shape, (3, 4))

    def test_cumulative_stats(self):
        """
        tests the cumulative_stats method in DatabaseUpdater
        """

        # initialize
        updater = DU()

        # get stats
        result = updater.cumulative_stats()
        self.assertTrue(type(result) == pd.DataFrame)
