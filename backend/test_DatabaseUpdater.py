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

        # test the connect and disconnect
        conn = updater.db_connect()
        self.assertTrue(False if conn is Exception else True)
        self.assertTrue(False if updater.db_disconnect(conn) is Exception else True)

    def test_get_globalhealth_data(self):
        """
        method to test the cleaning and generation of 
        the public health data
        """

        # initialize the object
        updater = DU()
        updater.get_globalhealth_data()

        # make sure there is something in the storage
        self.assertTrue(updater.new_data is not None)

    def test_db_update(self):
        """
        test the method to update the database
        """

        # create some dummy data to add to the db
        dummy_data = {"confirmed_date": ["10-19-2022", "10-19-2022", "10-19-2022"], 
                    "state_name": ["California", "Massachusetts", "Missouri"],
                    "num_cases": [10, 35, 3],
                    "is_predicted": [0, 0, 0]}
        dummy_df = pd.DataFrame(dummy_data)

        # open a connection to the db and update
        updater = DU()
        updater.db_update(dummy_df, "case_counts")

# manual tests
updater = DU()
updater.get_globalhealth_data()
