
"""
authors: Saketh Dendi, Felix Huang, and Sakin Kirti
since: 10/13/2022

The DatabaseSyncher class runs a constant cron timer. At the same time each day (potentially multiple times per day)
if calls the DatabaseUpdater Class to update our local database based on Global.Health's changes.

It also contains a backup method in case the cron timer fails to update the database when needed.
"""

import string
import schedule
import time

from DatabaseUpdater import DatabaseUpdater as du

class DatabaseSyncher:

    synchTime = ""

    def __init__(self) -> None:
        self.synchTime

    def job():
        print("I'm working...")

    def synchTimer(self):

        self.setSynchTime("10:30")

        schedule.every().day.at(self.synchTime).do(self.job)
        schedule.every().day.at(self.synchTime).do(du.db_connect)
        schedule.every().day.at(self.synchTime).do(du.db_update)

        while 1:
            schedule.run_pending()
            time.sleep(1)

    def setSynchTime(self):
        self.synchTime = self