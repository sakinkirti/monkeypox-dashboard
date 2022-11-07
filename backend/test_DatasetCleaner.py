from unittest import TestCase

from DatasetCleaner import DatasetCleaner as DC

class test_DatasetCleaner(TestCase):
    """
    author: Sakin Kirti
    date: 11/06/2022
    
    class to test methods on the DatasetCleaner class
    """

    def test_get_globalhealth_data(self):
        """
        method to test get_globalhealth_data method in DatasetCleaner
        """

        # tests full update functionality - without any other commands, this should update the db
        cleaner = DC(state_totals="https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts/exported_files/usmap_counts.csv",
                     seven_day_avg = "https://www.cdc.gov/poxvirus/monkeypox/modules/data-viz/mpx-cases-trend-7day.json",
                     country_time_series="https://raw.githubusercontent.com/gridviz/monkeypox/main/data/processed/monkeypox_cases_derived_timeseries_latest.csv",
                     globalhealth_data="https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest_deprecated.csv",
                     full_update=True)
