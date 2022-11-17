from unittest import TestCase
from DatabaseSyncher import DatabaseSyncher as DS
from DatabaseUpdater import DatabaseUpdater as DU

class test_DatabaseSyncher(TestCase):   
    """
    author: Saketh Dendi
    date: 10/20/2022
    
    class to test the methods and functionality in DatabaseSyncher
    """ 

    def test_currentTimer(self):
        """
        test the method to update the database
        """

        syncher = DS()
        syncher.job()

        self.assertTrue(syncher.job() == "I'm working...")

    def test_sync(self):
        """
        test the method that syncs the database
        """
        syncher = DS()
        updater = DU()
        syncher.sync()
        self.assertTrue(updater.get_data() == "I'm working...")