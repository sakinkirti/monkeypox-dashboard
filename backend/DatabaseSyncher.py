import schedule
import time

from DatabaseUpdater import DatabaseUpdater as DU

class DatabaseSyncher:
    """
    author: Saketh Dendi, Sakin Kirti, and Felix Huang
    date: 10/13/2022
    
    The DatabaseSyncher class runs a constant cron timer. At the same time each day (potentially multiple times per day)
    if calls the DatabaseUpdater Class to update our local database based on Global.Health's changes.

    It also contains a backup method in case the cron timer fails to update the database when needed.
    """

    def __init__(self):
        pass
    
    def job(self):
        """
        notify
        """

        print("I'm working...")

    def synchTimer(self):
        """
        method to update on sync timer
        """

        schedule.every().day.at("8:30").do(self.job)
        schedule.every().day.at("8:31").do(self.sync)

        while 1:
            schedule.run_pending()
            time.sleep(1)

    def sync(self):
        """
        method to sync the database with one command
        """

        # initialize helper ojects
        updater = DU()
        conn = updater.db_connect()
        cursor = conn.cursor()

        # get and store data
        updater.get_data()

        # update the tables
        for table,df in zip(["case_counts", "ph_stats"], updater.new_data):
            updater.fill_table(df, table, conn, cursor)

        updater.db_disconnect(conn)

syncher = DatabaseSyncher()
syncher.synchTimer()