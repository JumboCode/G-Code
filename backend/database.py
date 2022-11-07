'''
database.py
Purpose: Connects to the database and provides all functionality for accessing
         data from the database.
Authors: G-Code Jumbocode Team
'''

from backend.model import StudentInvite
from pymongo import MongoClient
from dotenv import load_dotenv
from model import Student, Admin, StudentInvite
import os

# load enviornment variables
load_dotenv()

# Connect to database
uri = os.environ["MONGO_DB_URI"]
client = MongoClient(uri, 8000)
database = client.db
students = database.students
admins = database.admins
si = database.student_invites


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

def fetch_all_student_invites():
    '''
    Purpose: Fetches all student requests from the student_requests collection and returns
             them as a list of Admin objects
    '''
    student_invites = []
    cursor = si.find({})
    for document in cursor:
        student_invites.append(StudentInvite(**document))
    return student_invites


async def create_student(Student):
    studToAdd = Student
    result = await students.insert_one(studToAdd)
    return studToAdd


async def create_student_invite(accessKey, email, date):
    inviteToAdd = StudentInvite()
    result = await si.insert_one(inviteToAdd)
    return inviteToAdd
