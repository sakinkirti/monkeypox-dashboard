import schedule
import time

from DatabaseUpdater import DatabaseUpdater as DU
from datetime import datetime

class DatabaseSyncher:
    """
    author: Saketh Dendi, Sakin Kirti, and Felix Huang
    date: 10/13/2022
    
    The DatabaseSyncher class runs a constant cron timer. At the same time each day (potentially multiple times per day)
    if calls the DatabaseUpdater Class to update our local database based on Global.Health's changes.

    It also contains a backup method in case the cron timer fails to update the database when needed.
    """

    def __init__(self, time: str):
        """
        initialization method
        """

        self.time = time
        print(f"Updater set to update at {self.time} UTC daily")
    
    def job(self):
        """
        notify
        """

        print("I'm working...")
        return "I'm working..."
    
    def currentTime(self):
        """
        returns the current time
        """

        return datetime.now().strftime('%H:%M')

    def synchTimer(self):
        """
        method to update on sync timer
        """

        schedule.every().day.at(self.time).do(self.job)
        schedule.every().day.at(self.time).do(self.sync)

        while 1:
            schedule.run_pending()
            time.sleep(1)

    def sync(self):
        """
        method to sync the database with one command
        """

        # initialize helper ojects
        updater = DU(db_reset=False)
        conn = updater.db_connect()
        cursor = conn.cursor()

        # get and store data
        updater.get_data()

        # update the tables based on the reset value
        if updater.reset == False:
            for table,df in zip(["case_counts", "ph_stats"], updater.new_data):
                updater.fill_table(df, table, conn, cursor)
        else:
            updater.db_update()

        # generate the predictions
        #updater.prediction_engine()

        # disconnect from db
        updater.db_disconnect(conn)
        print("completed filling the table")

if __name__ == "__main__":
    """
    main method:
    only if this file is run, these commands should be executed
    """
    
    syncher = DatabaseSyncher(time="22:00")
    syncher.synchTimer()
