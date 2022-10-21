from unittest import TestCase

from DatabaseSyncher import DatabaseSyncher as DS

class test_DatabaseSyncher:   
    """
    author: Saketh Dendi
    date: 10/20/2022
    
    class to test the methods and functionality in DatabaseSyncher
    """ 

    def test_synchTimer(self):
        """
        test the method to update the database
        """

        syncher = DS()
        syncher.synchTimer()

        self.assertTrue(syncher.synchTime is "10:30")