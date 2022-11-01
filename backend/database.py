'''
database.py
Purpose: Connects to the database and provides all functionality for accessing
         data from the database.
'''

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
    '''
    Purpose: Fetches all students from the students collection and returns
             them as a list of Student objects
    
    Todo:    1) Don't send student passwords back in response. This can either
                be done here or in main.py.
    '''
    student_list = []
    cursor = students.find({})
    for document in cursor:
        student_list.append(Student(**document))
    return student_list


def fetch_all_admins():
    '''
    Purpose: Fetches all admins from the admins collection and returns
             them as a list of Admin objects
    
    Todo:    1) Don't send student passwords back in response. This can either
                be done here or in main.py.
    '''
    admin_list = []
    cursor = admins.find({})
    for document in cursor:
        admin_list.append(Admin(**document))
    return admin_list 


