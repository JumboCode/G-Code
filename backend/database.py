from model import Student
from pymongo import MongoClient
import os

# Connect to database
uri = "mongodb+srv://admin:<password>@gcodedb.4dveheh.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri, 8000)
database = client.gcodedb
database = client.gcodedb
collection = database.students

async def fetch_one_student(title):
    document = collection.find_one({"title":title})
    return document