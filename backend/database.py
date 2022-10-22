from pymongo import MongoClient
from dotenv import load_dotenv
from model import Student
import os

# load enviornment variables
load_dotenv()

# Connect to database
uri = os.environ["MONGO_DB_URI"]
client = MongoClient(uri, 8000)
database = client.db
collection = database.students

def fetch_all_students():
    students = []
    cursor = collection.find({})
    for document in cursor:
        students.append(Student(**document))
    return students

__all__ = ("client", "database", "collection")