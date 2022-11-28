'''
database.py
Purpose: Connects to the database and provides all functionality for accessing
         data from the database.
'''

from model import StudentInvite
from model import Appointment
from pymongo import MongoClient
from dotenv import load_dotenv
from model import Student, Admin, StudentInvite
from datetime import datetime, timedelta
from bson.objectid import ObjectId 
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
appointments = database.appointments
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

async def fetch_one_invite(ak):
    document = await si.find_one({"accesscode": ak})
    return document

async def create_student(Student):
    studToAdd = Student
    result = await students.insert_one(studToAdd)
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


async def create_student_invite(ak, em, d):
    inviteToAdd = StudentInvite(email = em, accesscode = ak, date = d)
    result = await si.insert_one(inviteToAdd)
    return inviteToAdd


def create_appointment(appointment):
    result =  appointments.insert_one(appointment)
    return appointment

def reserve_appointment(appointmentID, studentID):
    appointments.update_one({"_id": ObjectId(appointmentID)}, { "$set": { "studentId": studentID, "reserved": True } })
    return appointmentID

def cancel_appointment(appointmentID):
    appointmentDoc = appointments.find_one({"_id": ObjectId(appointmentID)})
    if (appointmentDoc['startTime'] - timedelta(days=1) > datetime.today()):
        appointments.update_one({"_id": ObjectId(appointmentID)}, { "$set": { "studentId": "", "reserved": False } })
    return appointmentID


