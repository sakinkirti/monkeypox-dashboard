
"""
authors: Saketh Dendi, Felix Huang, and Sakin Kirti
since: 10/13/2022

The DatabaseSyncher class runs a constant cron timer. At the same time each day (potentially multiple times per day)
if calls the DatabaseUpdater Class to update our local database based on Global.Health's changes.

It also contains a backup method in case the cron timer fails to update the database when needed.
"""

import schedule
import time

from DatabaseUpdater import DatabaseUpdater as du

class DatabaseSyncher:
    """
    author: Saketh Dendi, Sakin Kirti, and Felix Huang
    date: 10/25/2022
    
    class to sync the database on a cron timer
    
    object should call several methods on the DatabaseUpdater on command
    1. initialize the Updater
    2. updater.get_data()
    3. updater.fill_table() - takes parameters
    """

    def __init__(self):
        pass
    
    def job(self):
        print("I'm working...")

    def synchTimer(self):

        schedule.every().day.at("10:30").do(self.job)
        schedule.every().day.at("11:30").do(du.db_connect)
        schedule.every().day.at("11:30").do(du.db_connect)

        while 1:
            schedule.run_pending()
            time.sleep(1)