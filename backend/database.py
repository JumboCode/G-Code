'''
database.py
Purpose: Connects to the database and provides all functionality for accessing
         data from the database.
'''

from model import StudentInvite
from pymongo import MongoClient
from dotenv import load_dotenv
from model import Student, Admin, Appointment
from datetime import datetime
import os

# load enviornment variables
load_dotenv()

# Connect to database
uri = os.environ["MONGO_DB_URI"]
client = MongoClient(uri, 8000)
database = client.db
students = database.students
admins = database.admins
appointments = database.appointments #change based on the actual collection
sessions = database.sessions
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

def fetch_one_invite(ak):
    document = si.find_one({"accesscode": ak})
    return document

def create_student(Student):
    studToAdd = Student
    result = students.insert_one(studToAdd)
    return studToAdd

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


def create_student_invite(ak, em, d):
    inviteToAdd = {
        "accesscode": ak,
        "requestdate": d,
        "email": em
    }
    si.insert_one(inviteToAdd) 
    return inviteToAdd

def remove_student_invite(ak):
    si.delete_one({"accesscode": ak})
    return True

def fetch_filtered_appointments(filters):
    filter_dict = {"reserved" : False}

    for fil in filters:
        filter_dict.update({fil[0]:fil[1]})
    
    appt_list = []
    cursor = appointments.find(filter_dict)
    print (cursor)
    for document in cursor:
        print(document)
        appt_list.append(Appointment(**document))
    return appt_list

def get_assignments_by_assignment_id(assignmentid):
    cursor = assignments.find({"assignmentid": assignmentid})
    assignment_list = []
    for document in cursor:
        assignment_list.append(Assignment(**document))
    return assignment_list

def get_assignments_by_student_id(studentid):
    cursor = assignments.find({"studentid": studentid})
    assignment_list = []
    for document in cursor:
        assignment_list.append(Assignment(**document))
    return assignment_list