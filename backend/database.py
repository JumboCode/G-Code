from pymongo import MongoClient
from settings import mongo_settings as settings

# Connect to database
uri = "mongodb+srv://admin:Jumbo2022@cluster0.byfiocg.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri, 8000)
database = client.db
collection = database.students

__all__ = ("client", "database", "collection")