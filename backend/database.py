'''
database.py
Purpose: Connects to the database and provides all functionality for accessing
         data from the database.
'''

from model import StudentInvite
from model import Appointment
from pymongo import MongoClient
from dotenv import load_dotenv
from model import Student, Admin, StudentInvite, Appointment
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
appointments = database.appointments #change based on the actual collection
sessions = database.sessions
appointments = database.appointments
si = database.student_invites
ai = database.admin_invites


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

def create_new_user(firstname, lastname, email, account_type):
        
    newUser = {
        'firstname': firstname,
        'lastname': lastname,
        "email": email,
        "emailverified": False,
    }

    if (account_type == "Student"):
        students.insert_one(newUser)
    elif (account_type == "Tutor"):
        admins.insert_one(newUser)

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

def fetch_user_by_email(email):
    '''
    Purpose: Fetchs the user, either an admin or student, with the given email
    '''

    user = students.find_one({"email": email})
    if user is None:
        user = admins.find_one({"email": email})
    return user


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

def create_admin_invite(ak, em, d):
    inviteToAdd = {
        "accesscode": ak,
        "requestdate": d,
        "email": em
    }
    ai.insert_one(inviteToAdd) 
    return inviteToAdd

def create_appointment(appointment):
    '''
    Purpose: Creates an appointment and associates with the admin creating it 
    '''
    result =  appointments.insert_one(appointment)
    return appointment

def reserve_appointment(appointmentID, studentID):
    '''
    Purpose: Links an appointment to a student when that students reserves the appointment, 
             and marks as reserved 
    '''
    appointments.update_one({"_id": ObjectId(appointmentID)}, { "$set": { "studentId": studentID, "reserved": True } })
    return appointmentID

def cancel_appointment(appointmentID):
    '''
    Purpose: If there are more than 24 before the appointment, cancel and unmark as reserved
    '''
    appointmentDoc = appointments.find_one({"_id": ObjectId(appointmentID)})
    if (appointmentDoc['startTime'] - timedelta(days=1) > datetime.today()):
        appointments.update_one({"_id": ObjectId(appointmentID)}, { "$set": { "studentId": "", "reserved": False } })
    return appointmentID

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
