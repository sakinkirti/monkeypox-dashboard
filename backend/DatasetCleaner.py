import datetime
import pandas as pd
import numpy as np

from sklearn.linear_model import LinearRegression

class DatasetCleaner:
    """
    authors: Sakin Kirti, Saketh Dendi, and Felix Huang
    since 10/13/2022

    The DatasetCleaner takes a database given by the DatabaseUpdater and cleans the data to make it easily workable.
    It returns this database to the DatabaseUpdater to update in the local database.
    """

    def __init__(self, state_totals: str, globalhealth_data: str, full_update: bool):
        """
        initialize the object

        params:
        data - the pandas.DataFrame to clean (should be the Global.Health dataset)
        """

        # set the cleaned data
        self.confirmed_cases = pd.DataFrame(columns=["confirmed_date", "state_name", "num_cases", "is_predicted"])
        self.ph_stats = None
        self.cleaned_data = [self.confirmed_cases, self.ph_stats]

        # the global.health data should only be updated one time (on full_update)
        if full_update:
            self.gh_data = self.read_globalhealth_data(data=globalhealth_data)

        # cdc data
        self.cdc_data = pd.read_csv(state_totals)
        self.wrangle(data=state_totals)

    def retrieve_cleaned_data(self):
        """
        method to get the cleaned data from the object
        """

        # return the cleaned data
        return self.cleaned_data

    def set_cleaned_data(self):
        """
        method to set the cleaned data to the right variables
        """

        self.cleaned_data = [self.confirmed_cases, self.ph_stats]

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
        table.loc[len(table)+1] = [datetime.date.today(), "Puerto Rico", 0, 0]

        # convert date to datetime format
        table["confirmed_date"].astype(str)

        # global.health data should only be set one time
        # updater.db_update(data=table, table="case_counts")

        # set to confirmed cases
        self.confirmed_cases = table

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
        df.rename(columns={"Cases": "num_cases", "Location": "state_name"}, inplace=True)

        # remove unecessary rows
        df = df.set_index("state_name").drop("Non-US Resident")
        df = df.drop("Total").reset_index()

        # convert to daily counts from cumulative
        old_df = pd.DataFrame(updater.db_retrieve(table="case_counts"))
        old_df.rename(columns={0: "confirmed_date", 1: "state_name", 2: "num_cases", 3: "is_predicted"}, inplace=True)
        temp = old_df.groupby(["state_name"]).sum(numeric_only=True).reset_index()
        temp.sort_values(by=["state_name"], inplace=True)
        df.sort_values(by=["state_name"], inplace=True)
        df["num_cases"] = df["num_cases"] - temp["num_cases"]

        # store the values to update the table
        self.confirmed_cases = pd.concat([self.confirmed_cases, df], ignore_index=True)

    def generate_ph_stats(self):
        """
        method to generation public health statistics

        incidence rate: (total cases) / (population) * 1000
        prevalence rate: (new cases) / (population) * 1000
        case-fatality rate: (number of deaths) / (number of cases) * 1000
        """

        from DatabaseUpdater import DatabaseUpdater as DU
        updater = DU()

        # us population
        pop = 332403650
        ph_table = pd.DataFrame(columns=["prevalence_curr", "incidence_curr", "cf_ratio_curr", "prevalence_pred", "incidence_pred", "cf_ratio_pred"])

        # current prevalence rate - cumulative cases / population per 1000 people
        p_curr = (self.cdc_data["Cases"].sum() / pop) * 1000
        # current incidence rate - new cases / population per 1000 people
        i_curr = (self.confirmed_cases["num_cases"].sum() / pop) * 1000
        # current case fatality ratio - cumulative cases / cumulative deaths per 1000 people
        cf_curr = (20 / self.cdc_data["Cases"].sum()) * 1000

        # initialize and create necessary tables for ph predictions
        df = pd.DataFrame(updater.db_retrieve("ph_stats"))
        df.rename(columns={0:"prevalence_curr", 1:"incidence_curr", 2:"cf_ratio_curr", 3:"prevalence_pred", 4:"incidence_pred", 5:"cf_ratio_pred"}, inplace=True)

        # get numpy of each current stat
        prev = df["prevalence_curr"].to_numpy().reshape((1, -1))
        inci = df["incidence_curr"].to_numpy().reshape((1, -1))
        cf_r = df["cf_ratio_curr"].to_numpy().reshape((1, -1))

        # generate x values
        exes = np.arange(0, len(prev)).reshape((-1, 1))

        # create models for each
        prev_model = LinearRegression().fit(exes, prev)
        inci_model = LinearRegression().fit(exes, inci)
        cf_r_model = LinearRegression().fit(exes, cf_r)

        # generate predictions for new day
        p_pred = prev_model.predict(np.array([len(prev)]).reshape((1, -1)))
        i_pred = inci_model.predict(np.array([len(inci)]).reshape((1, -1)))
        cf_pred = cf_r_model.predict(np.array([len(cf_r)]).reshape((1, -1)))

        # add to table
        ph_table.loc[0] = [p_curr, i_curr, cf_curr, p_pred[0][0], i_pred[0][0], cf_pred[0][0]]
        self.ph_stats = ph_table

        return ph_table
