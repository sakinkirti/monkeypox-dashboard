from unittest import TestCase
from DatasetCleaner import DatasetCleaner as DC

class test_DatasetCleaner(TestCase):
    """
    author: Sakin Kirti
    date: 11/06/2022
    
    class to test methods on the DatasetCleaner class
    """

    def test_wrangle(self):
        """
        method to test get_globalhealth_data method in DatasetCleaner
        """

        # tests full update functionality - without any other commands, this should update the db
        cleaner = DC(state_totals="https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts/exported_files/usmap_counts.csv",
                     globalhealth_data="https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest_deprecated.csv",
                     full_update=False)

        # check the column characteristics
        self.assertEqual(len(cleaner.confirmed_cases), 4)
        self.assertEqual(cleaner.confirmed_cases.columns.tolist(), ["confirmed_date", "state_name", "num_cases", "is_predicted"], "column names are incorrect")
        
        # check column data types
        self.assertEqual(cleaner.confirmed_cases.dtypes().tolist(), [str, str, str, str], "data types are incorrect")

        # check number of NA values
        self.assertEqual(cleaner.confirmed_cases.isnull().sum(), 0)

    def test_retrieve_cleaned_data(self):
        """
        method to test the retrieve cleaned data method
        """
        
        # initialize the cleaner
        cleaner = DC(state_totals="https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts/exported_files/usmap_counts.csv",
                     globalhealth_data="https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest_deprecated.csv",
                     full_update=True)

        