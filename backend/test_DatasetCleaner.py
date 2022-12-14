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

        # tests full update functionality - without any other commands, this should update the data stored in new_data 
        cleaner = DC(state_totals="https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts/exported_files/usmap_counts.csv",
                     globalhealth_data="https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest_deprecated.csv",
                     full_update=False)

        # check the column characteristics - 52, one for each state + PR and DC
        self.assertEqual(len(cleaner.confirmed_cases), 52)
        self.assertEqual(list(cleaner.confirmed_cases.columns), ["confirmed_date", "state_name", "num_cases", "is_predicted"], "column names are incorrect")

        # check number of NA values - should be 0
        self.assertEqual(cleaner.confirmed_cases.isnull().sum().sum(), 0)

    def test_retrieve_cleaned_data(self):
        """
        method to test the retrieve cleaned data method
        """
        
        # initialize the cleaner
        cleaner = DC(state_totals="https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts/exported_files/usmap_counts.csv",
                     globalhealth_data="https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest_deprecated.csv",
                     full_update=True)

        # retreive the data
        case_counts, ph_stats = cleaner.retrieve_cleaned_data()

        # similar tests as wrangle testing method
        self.assertTrue(len(case_counts) > 52)
        self.assertEqual(list(case_counts.columns), ["confirmed_date", "state_name", "num_cases", "is_predicted"], "column names are incorrect")
        self.assertEqual(case_counts.isnull().sum().sum(), 0)

    def test_read_globalhealth_data(self):
        """
        method to test the read global.health data method
        """

        cleaner = DC(state_totals="https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts/exported_files/usmap_counts.csv",
                     globalhealth_data="https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest_deprecated.csv",
                     full_update=True)

        cleaner.read_globalhealth_data()

        # check the confirmed cases variable - confirmed cases is initialized as None and is set to the new dataframe
        self.assertTrue(cleaner.confirmed_cases != None)

    def test_generate_ph_stats(self):
        """
        method to test the generate ph stats method
        """

        cleaner = DC(state_totals="https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts/exported_files/usmap_counts.csv",
                     globalhealth_data="https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest_deprecated.csv",
                     full_update=True)

        