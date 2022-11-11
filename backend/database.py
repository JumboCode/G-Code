'''
database.py
Purpose: Connects to the database and provides all functionality for accessing
         data from the database.
Authors: G-Code Jumbocode Team
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
sessions = database.sessions


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

def fetch_student_by_username(username):
    '''
    Purpose: Fetch the student with the given username
    '''
    return students.find_one({"username": username})

def fetch_admin_by_username(username):
    '''
    Purpose: Fetch the student with the given username
    '''
    return admins.find_one({"username": username})

def fetch_session_by_username(username):
    '''
    Purpose: Fetchs a session from the database with the given unique username
    '''
    return sessions.find_one({"username": username})


def add_session(username, permission_level, curr_time):
    '''
    Purpose: Adds a session to the database. 
    A Time-To-Live Index on the database automatically deletes sessions 
    four hours after their creation
    '''
    new_session = {"username": username, 
                   "permission_level": permission_level, 
                   "created_at": curr_time}
                   
    sessions.insert_one(new_session)

def remove_session(username):
    '''
    Purpose: Removes a session from the database
    '''
    sessions.delete_one({"username": username})

