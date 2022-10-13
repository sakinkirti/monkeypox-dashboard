
"""
authors: Saketh Dendi, Felix Huang, and Sakin Kirti
since: 10/13/2022

The DatabaseSyncher class runs a constant cron timer. At the same time each day (potentially multiple times per day)
if calls the DatabaseUpdater Class to update our local database based on Global.Health's changes.

It also contains a backup method in case the cron timer fails to update the database when needed.
"""