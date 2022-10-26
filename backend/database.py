from pymongo import MongoClient
from dotenv import load_dotenv
from model import Student, Admin
import os

# load enviornment variables
load_dotenv()

# Connect to database
uri = os.environ["MONGO_DB_URI"]
client = MongoClient(uri, 8000)
database = client.db
students = database.students
admins = database.admins


def fetch_all_students():
    student_list = []
    cursor = students.find({})
    for document in cursor:
        student_list.append(Student(**document))
    return student_list


def fetch_all_admins():
    admin_list = []
    cursor = admins.find({})
    for document in cursor:
        admin_list.append(Admin(**document))
    return admin_list 