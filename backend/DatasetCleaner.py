import datetime
import pandas as pd
import requests
import json

class DatasetCleaner:
    """
    authors: Sakin Kirti, Saketh Dendi, and Felix Huang
    since 10/13/2022

    The DatasetCleaner takes a database given by the DatabaseUpdater and cleans the data to make it easily workable.
    It returns this database to the DatabaseUpdater to update in the local database.
    """

    def __init__(self, state_totals: str, seven_day_avg: str, country_time_series: str, globalhealth_data: str, full_update: bool):
        """
        initialize the object

        params:
        data - the pandas.DataFrame to clean (should be the Global.Health dataset)
        """

        # storage for data
        self.country_time_series = pd.read_csv(country_time_series)

        # set the cleaned data
        self.confirmed_cases = None
        self.ph_stats = None
        self.cleaned_data = (self.confirmed_cases, self.ph_stats)

        # the global.health data should only be updated one time
        if full_update:
            self.gh_data = self.read_globalhealth_data(data=globalhealth_data)

        # cdc data
        self.cdc_data = self.wrangle(data=state_totals)

    def retrieve_cleaned_data(self):
        """
        method to get the cleaned data from the object
        """

        # return the cleaned data
        return self.cleaned_data

    def read_globalhealth_data(self, data: str):
        """
        method to read the global.health data from their public api. This dataset has been deprecated, but still
        contains the history of cases. We use this to populate the first one-hundred days worth of data before 
        transitioning to use the CDC as the data source.

        This method should only be run one time. After that the global.health data should be stored in the AWS
        database. Only the CDC data should need updating.
        
        params:
        - the link to to the global.health api
        
        returns:
        - the cleaned global.health data
        """

        from DatabaseUpdater import DatabaseUpdater as DU
        updater = DU()

        # read the csv
        df = pd.read_csv(data, low_memory=False)

        # filter to US only
        df = df[df["Country"] == "United States"]

        # drop unnecessary columns
        df = df.drop(
            columns=["Date_onset", "Symptoms", "Date_isolation", "Confirmation_method", "Genomics_Metadata", "Date_hospitalisation", "Contact_ID", "Contact_comment", "Contact_location",
                    "Country_ISO3", "Age", "Gender", "Hospitalised (Y/N/NA)", "Source_II", "Source_III", "Source_IV", "Source_V", "Source_VI", "Source_VII", "Date_entry", "Date_death",
                    "Date_last_modified", "City", "Country", "Source", "Travel_history_country", "Travel_history_location", "Travel_history_start", "Travel_history_entry", "Travel_history (Y/N/NA)", 
                    "Outcome", "Isolated (Y/N/NA)"]
        )

        # add state names to df
        df = df.astype(str)
        states=["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
                "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
                "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
                "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
        dates = df["Date_confirmation"].unique()
        df["State"] = pd.NA
        for id,row in df.iterrows():
            for state in states:
                if state in row['Location']:
                    row['State'] = state

        # drop other unnecesary columns
        df = df.drop(columns=["Location", "ID"])

        # repopulate a table with the needed values
        table = pd.DataFrame(columns=["confirmed_date", "state_name", "num_cases", "is_predicted"])
        for state in states:
            for date in dates:
                res = df[df["State"] == state]
                res = res[res["Date_confirmation"] == date]

                table.loc[len(table.index)+1] = [date, state, len(res), 0]

        # add dummy data for District of Columbia
        table.loc[len(table)+1] = [datetime.date.today(), "District of Columbia", 0, 0]

        # convert date to datetime format
        table["confirmed_date"].astype(str)

        # global.health data should only be set one time
        updater.db_update(data=table, table="case_counts")

        # set variables and return the reformed data
        return table

    def wrangle(self, data: str):
        """
        method to clean the data from global.health
        """

        from DatabaseUpdater import DatabaseUpdater as DU
        updater = DU()

        # get total US case counts
        df = pd.read_csv(data)

        # drop/reset necessary columns
        df = df.drop(columns=["Case_Range", "AsOf"])
        df["confirmed_date"] = datetime.date.today()
        df["is_predicted"] = 0
        df.rename({"Cases": "num_cases", "Location": "state_name"})

        # convert to daily counts from cumulative
        old_df = pd.DataFrame(updater.db_retreive(table="case_counts"))
        old_df = old_df.groupby(["state_name"]).sum()
        df["Cases"] = df["Cases"] - old_df["num_cases"]

    def generate_ph_stats(self):
        """
        method to generation public health statistics

        # INCIDENCE RATE: (new cases) / (population * timeframe)
        # can calculate 5-day moving incidence rate (new cases of last 5 days / (total us population * 5 days))
        # will want incidence rate for entire US by date
        # will want incidence rate per state by date as well

        # PREVALENCE RATE: (total cases) / (population)
        # will want prevalence rate for enture US by date
        # will want prevalence rate per state by date as well

        # CASE-FATALITY RATIO: (number of deaths) / (number of cases)
        # will want case-fatality ratio for entire US by date
        # will want case-fatality ratio per state by date as well
        """

    def predict_cases(self):
        """
        method to create predictions based on the cleaned global health data
        """

    def predict_ph_stats(self):
        """
        method to generate the predicted public health statistics
        
        this is done based on the case count predictions
        """
