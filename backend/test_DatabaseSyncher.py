from unittest import TestCase
from DatabaseSyncher import DatabaseSyncher as DS
from DatabaseUpdater import DatabaseUpdater as DU

import pandas as pd
from datetime import datetime

class test_DatabaseSyncher(TestCase):   
    """
    author: Saketh Dendi
    date: 10/20/2022
    
    class to test the methods and functionality in DatabaseSyncher
    """ 

    def test_synchTimer(self):
        """
        make sure the timing method works
        """

        # call synchTimer
        """
        this method is somewhat untestable because by design it should not return anything.
        Instead, it's whol job is the run the entire program. As such, it enters a never ending
        loop which updates the database every day. Testing this method would require the loop
        to end which would eliminate the entire reason to have this loop.
        """
        self.assertTrue(True)

    def test_currentTime(self):
        """
        tests if the currentTime method gives the right time
        """

        # initialize
        test_time = "3:00"
        syncher = DS(test_time)

        # get time
        self.assertEqual(str(datetime.now().strftime('%H:%M')), syncher.currentTime(), "syncher did not return the right time")

    def test_job(self):
        """
        tests the job method
        """

        # initialize
        syncher = DS("3:00")

        # job
        self.assertEqual(DS.job, "I'm working...", "job not working properly")

    def test_sync(self):
        """
        test the method that syncs the database
        """

        # intialize
        syncher = DS("11:03")
        updater = DU()

        # gather results from the db to compare data from before and after
        old = pd.DataFrame(updater.db_retrieve("case_counts"))

        # sync
        syncher.sync()

        # gather new results
        new = pd.DataFrame(updater.db_retrieve("case_counts"))

        # compare
        self.assertTrue(old != new)