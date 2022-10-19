import pandas as pd

class DatasetCleaner:
    """
    authors: Sakin Kirti, Saketh Dendi, and Felix Huang
    since 10/13/2022

    The DatasetCleaner takes a database given by the DatabaseUpdater and cleans the data to make it easily workable.
    It returns this database to the DatabaseUpdater to update in the local database.
    """

    def __init__(self, data: str):
        """
        initialize the object

        params:
        data - the pandas.DataFrame to clean (should be the Global.Health dataset)
        """

        # storage for data
        self.raw_data = pd.read_csv(data)
        self.cleaned_data

    def retrieve_cleaned_data(self):
        """
        method to get the cleaned data from the object
        """

        # return the cleaned data
        return self.cleaned_data

    def wrangle(self):
        """
        method to clean the data from global.health
        
        NOTE: This data is very messy. Will update with the specific things that are completed to clean data
        """

        # filter the dataset to US only cases
        temp = self.raw_data["Country"]  == "United States"
        
        # create a new column with state specific data
        temp["Location"] = temp["Location"].astype(str)
        states = ["Alabama ", "Alaska ", "Arizona ", "Arkansas ", "California ", "Colorado ", "Connecticut ", "Delaware ", "Florida ", 
                  "Georgia ", "Hawaii ", "Idaho ", "Illinois ", "Indiana ", "Iowa ", "Kansas ", "Kentucky ", "Louisiana ", "Maine ", 
                  "Maryland ", "Massachusetts ", "Michigan ", "Minnesota ", "Mississippi ", "Missouri ", "Montana ", "Nebraska ", "Nevada ", 
                  "New ", "Hampshire ", "New ", "Jersey ", "New ", "Mexico ", "New ", "York ", "North ", "Carolina ", "North ", "Dakota ", 
                  "Ohio ", "Oklahoma ", "Oregon ", "Pennsylvania ", "Rhode ", "Island ", "South ", "Carolina ", "South ", "Dakota ", 
                  "Tennessee ", "Texas ", "Utah ", "Vermont ", "Virginia ", "Washington ", "West ", "Virginia ", "Wisconsin ", "Wyoming"]
        temp["State"] = pd.NA
        for id,row in temp.iterrows():
            for state in states:
                if state in row['Location']:
                    temp.loc[id,'State'] = state

        # we trust where the data is coming from, so we can remove the 'source' columns
        temp = temp.drop(columns=[column for column in temp.columns if "Source" in column])

        # drop other irrelevant columns
        temp = temp.drop(
            columns=["Date_onset", "Symptoms", "Date_isolation", "Confirmation_method", "Genomics_Metadata", "Date_hospitalisation", 
                     "Contact_ID", "Contact_comment", "Contact_location"]
        )

        # add column denoting whether the case is given or predicted
        temp["prediction"] = "no"

    def generate_ph_stats(self):
        """
        method to generation public health statistics
        """

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

    def predict_cases(self):
        """
        method to create predictions based on the cleaned global health data
        """
