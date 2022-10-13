import pandas as pd

"""
authors: Sakin Kirti, Saketh Dendi, and Felix Huang
since 10/13/2022

The DatasetCleaner takes a database given by the DatabaseUpdater and cleans the data to make it easily workable.
It returns this database to the DatabaseUpdater to update in the local database.
"""

class DatasetCleaner:
    """
    class to clean the given data
    """

    def __init__(self, data: pd.DataFrame):
        """
        initialize the object

        params:
        data - the pandas.DataFrame to clean (should be the Global.Health dataset)
        """

        self.data = data

    def clean(self):
        """
        method to clean the data given at the initialization
        """

        
