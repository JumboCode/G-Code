'''
database.py
Purpose: Connects to the database and provides all functionality for accessing
         data from the database.
'''

from pymongo import MongoClient
from dotenv import load_dotenv
from model import *
from datetime import datetime, timedelta
from bson.objectid import ObjectId
import os
from typing import Any

# Connect to database
load_dotenv()
uri      = os.environ["MONGO_DB_URI"]
client   = MongoClient(uri, 8000)
database = client.db

users        = database.users
appointments = database.appointments #change based on the actual collection
sessions     = database.sessions
assignments  = database.assignments
si           = database.student_invites
ai           = database.admin_invites
ui           = database.user_invites
classes      = database.classes
questions    = database.questions
posts        = database.posts


model_dic = {"Users": UserIn, "UserInvites": UserInvite, "StudentInvites": UserInvite, "AdminInvites": UserInvite, "Appointments": Appointment, "Questions": Question, "Sessions": Any}

db_dic = {"Users":users, "UserInvites": ui, "StudentInvites" : si, "AdminInvites": ai, "Appointments":appointments, "Questions":questions, "Sessions":sessions, "Assignments": assignments}

def stringify_id(object):
    try:
        object.id = str(object.id)
    except:
        pass
    return object

#TODO: Make all fetch_all be able to go through the base one (could have a helper function for filters but I don't think there needs to be one?)
#TODO: Maybe have two more where it's like return 1 and return filtered/all list and then if there's more than 1 that it finds throw an error
## Find can take a list of fields to return, so for stuff like user, pass in a list so you don't return the password
def fetch_all(model_class):
    result_list = []
    db = db_dic[model_class]
    cursor = db.find({})
    for document in cursor:
        result_list.append(stringify_id(model_dic[model_class](**document)))
    return result_list

def fetch_one(model_class: str, field_name: str, field_value: Any):
    result_list = []
    db = db_dic[model_class]
    cursor = db.find({field_name: field_value})
    for document in cursor:
        result_list.append(model_dic[model_class](**document))
    if len(result_list) == 0:
        return "No Result Found"
    elif len(result_list) > 1:
        return "Multiple Instances Found"
    return result_list[0]

def fetch_filtered(model_class: str, filters: list[tuple]):
    result_list = []
    db = db_dic[model_class]
    filter_dict = {}

    if (model_class == "Appointments"):
        filter_dict.update({"reserved" : False})

    for filter in filters:
        if (len(filter) == 2):
            filter_dict.update({filter[0]:filter[1]})
    
    cursor = db.find(filter_dict)
    for document in cursor:
        result_list.append(model_dic[model_class](**document))
    
    return result_list

def fetch3Appointments():
    db = db_dic["Appointments"]
    result_list = []
    cursor = db.find({}).sort("date", -1).limit(3)
    for document in cursor:
        result_list.append(model_dic["Appointments"](**document))
    return result_list

def create_new_user(user: UserIn):
    users.insert_one(user)
    
    # newUser = {
    #     'firstname': firstname,
    #     'lastname': lastname,
    #     "email": email,
    #     "emailverified": False,
    # }
    # if (account_type == "Student"):
    #     students.insert_one(newUser)
    # elif (account_type == "Tutor"):
    #     admins.insert_one(newUser)

# def create_student(Student):
#     studToAdd = Student
#     result = students.insert_one(studToAdd)
#     return studToAdd

def fetch_user_by_email(email):
    user = users.find_one({"email": email}, {'_id': 0})
    return user

# def fetch_user_by_email(email):
#     '''
#     Purpose: Fetchs the user, either an admin or student, with the given email
#     '''
#     user = students.find_one({"email": email})
#     if user is None:
#         user = admins.find_one({"email": email})
#     return user


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

def fetch_session_by_username(username):
    sessions.find({"username": username})

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

def fetch_all_posts():
    '''
    Purpose: Returns all posts stored in the database
    '''
    posts_list = []
    cursor = posts.find({})
    for document in cursor:
        document['id'] = str(document['_id'])
        posts_list.append(PostID(**document))
    return posts_list

def create_post(post: Post):
    posts.insert_one(post)
    return post

def add_reply(post_ID: str, reply_data: Reply):
    posts.update_one(
        {"_id": post_ID},
        { "$push": {"replies": reply_data}}
        )
    return post_ID
