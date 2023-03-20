'''
database.py
Purpose: Connects to the database and provides all functionality for accessing
         data from the database.
'''

from pymongo import MongoClient
from dotenv import load_dotenv
from model import Student, Admin, UserInviteRequest, Appointment, Question
from datetime import datetime, timedelta
from bson.objectid import ObjectId
import os
from typing import Any

# Connect to database
load_dotenv()
uri = os.environ["MONGO_DB_URI"]
client = MongoClient(uri, 8000)
database = client.db
students = database.students
admins = database.admins
appointments = database.appointments #change based on the actual collection
sessions = database.sessions
appointments = database.appointments
user_invites = database.user_invites
ai = database.admin_invites
questions = database.questions

model_dic = {"Students":Student, "Admins":Admin, "Invites": UserInviteRequest, "Appointments": Appointment, "Questions": Question, "Sessions": Any}

db_dic = {"Students":students, "Admins":admins, "Invites":user_invites,"Appointments":appointments, "Questions":questions, "Sessions":sessions}


#TODO: Make all fetch_all be able to go through the base one (could have a helper function for filters but I don't think there needs to be one?)
#TODO: Maybe have two more where it's like return 1 and return filtered/all list and then if there's more than 1 that it finds throw an error
## Find can take a list of fields to return, so for stuff like user, pass in a list so you don't return the password
def fetch_all(model_class):
    result_list = []
    db = db_dic[model_class]
    cursor = db.find({})
    for document in cursor:
        result_list.append(model_dic[model_class](**document))
    return result_list

def fetch_one_by_field(model_class: str, field_name: str, field_value: Any):
    result_list = []
    db = db_dic[model_class]
    cursor = db.find({field_name: field_value})
    if len(cursor) > 1:
        return "Multiple Instances Found"
    return model_dic[model_class](**(cursor[0]))

def fetch_one_invite(ak):
    document = user_invites.find_one({"accesscode": ak})
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

def fetch_user_by_username(username):
    user = students.find_one({"username": username},{'_id': 0})
    if user is None:
        user = admins.find_one({"username": username},{'_id': 0})
    return user

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


def create_user_invite(user_invite_request: UserInviteRequest, date: datetime, accesscode: str):
    user_invite_request.update({"date": date, "accesscode": accesscode})
    user_invites.insert_one(user_invite_request) 
    return user_invite_request

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
