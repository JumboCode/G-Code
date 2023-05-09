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
posts        = database.posts


model_dic = {"Users": User, "UserInvites": UserInvite, "StudentInvites": UserInvite, "AdminInvites": UserInvite, "Appointments": AppointmentBooking, "Posts": Post, "Sessions": Any, "Assignments": Assignment}

db_dic = {"Users":users, "UserInvites": ui, "StudentInvites" : si, "AdminInvites": ai, "Appointments":appointments, "Posts":posts, "Sessions":sessions, "Assignments": assignments}

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

def fetch3Appointments(studentEmail):
    result_list = []
    print("email: " + studentEmail)
    cursor = appointments.find({"studentEmail" : studentEmail}).sort("date", -1).limit(3)
    for document in cursor:
        result_list.append(stringify_id(AppointmentBooking(**document)))
    return result_list

def create_one (model_class: str, to_add):
    db = db_dic[model_class]
    if isinstance(to_add, model_dic[model_class]):
        db.insert_one(to_add.dict())
    else:
        raise Exception("The given object was not an instance of the given model_class")


def create_new_user(user: UserIn):
    users.insert_one(user)
    
def update_profile_field(email: str, field: str, val):
    users.update_one( 
        {"email": email},
        { "$set": {field:val}}
    )

def fetch_user_by_email(email):
    result_list = []
    cursor = users.find({"email": email})
    for document in cursor:
        result_list.append(stringify_id(User(**document)))
    if len(result_list) == 0:
        return "No Result Found"
    elif len(result_list) > 1:
        return "Multiple Instances Found"
    return result_list[0]

def set_schedule(data: dict):
    user = fetch_user_by_email(data.get("email"))
    if (user == None):
        return "User not found"
    if (user["type"] != "Admin" and user["type"] != "admin"):
        return "User is not admin"
    
    filter = { 'email' : user["email"] }
    default = data.get('default')
    data.pop('default')
    data.pop('email')
    print(data)
    users.update_one( 
        {"email": user["email"]},
        { "$set": data}
    );

def create_individual_assignment(assignmentid: str, indiv_assignment: IndividualAssignment):
    print(assignmentid)
    assignments.update_one(
        {"assignmentid": assignmentid},
        { "$push": {"individual_assignments": indiv_assignment}}
        )
    return assignmentid

def get_all_student_assignments(student_email):
    cursor = assignments.find({},
        {"individual_assignments": { '$elemMatch': { "student_email": student_email }},
         "name": 1, "description": 1, "dueDate": 1, "_id": False})
    assignment_list = []
    for document in cursor:
        if "individual_assignments" in document:
            assignment_list.append(document)
    return assignment_list

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

def create_user_invite(inviteToAdd : UserInvite):
    ui.insert_one(inviteToAdd) 
    return inviteToAdd


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
    appointmentDoc = appointments.delete_one({"_id": ObjectId(appointmentID)})
    # if (appointmentDoc['startTime'] - timedelta(days=1) > datetime.today()):
    # appointments.update_one({"_id": ObjectId(appointmentID)}, { "$set": { "studentName": "", "reserved": False , "studentEmail":""} })
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

def create_individual_assignment(assignmentid: str, indiv_assignment: IndividualAssignment):
    print("in create indiv assignment")
    print(assignmentid)
    assignments.update_one(
        {"assignmentid": assignmentid},
        { "$push": {"individual_assignments": indiv_assignment}}
        )
    return assignmentid

def get_all_student_assignments(student_email):
    '''
    Purpose: Returns all assignments assigned to a given student
    '''
    cursor = assignments.find({}, 
        {"individual_assignments": { '$elemMatch': { "student_email": student_email }},
         "name": 1, "description": 1, "dueDate": 1, '_id': False})
    assignment_list = []
    for document in cursor:
        if 'individual_assignments' in document:
            assignment_list.append(document)
    return assignment_list

###################################################################
############################## Posts ##############################
###################################################################

def fetch_all_posts_sorted():
    result_list = []
    cursor = posts.find({})
    cursor.sort('date')
    for document in cursor:
        result_list.append(stringify_id(Post(**document)))
    return result_list[::-1]

def insert_post(post: PostIn, author_id: str, date: datetime):
    posts.insert_one({**post, 
                      'author_id': str(author_id), 
                      'date': date, 
                      'replies': []})

def add_reply(post_ID: str, reply_data: Reply):
    id = ObjectId(post_ID)
    posts.update_one({"_id": id},
                     { "$push": {"replies": reply_data.dict()}}
                     )
    return post_ID