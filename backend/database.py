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
appointments = database.appointments
sessions     = database.sessions
assignments  = database.assignments
user_invites = database.user_invites
classes      = database.classes
posts        = database.posts
reset_codes = database.password_reset_codes


model_dic = {"Users": User, "UserInvites": UserInvite, "Appointments": AppointmentBooking, "Posts": Post, "Sessions": Any, "Assignments": Assignment}

db_dic = {"Users":users, "UserInvites": user_invites, "Appointments":appointments, "Posts":posts, "Sessions":sessions, "Assignments": assignments}

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
    return stringify_id(result_list[0])

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
        result = db.insert_one(to_add.dict())
        return result
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

def set_schedule(appointment_schedule: AppointmentSchedule, user_id: str):
    users.update_one( 
        {"_id": ObjectId(user_id)},
        { "$set": {'appointment_schedule': appointment_schedule.dict()}}
    )

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


def create_student_invite(accesscode, email, acctype, date):
    inviteToAdd = UserInvite(accesscode=accesscode, email=email, acctype=acctype, date=date)
    user_invites.insert_one(inviteToAdd.dict()) 
    return inviteToAdd

def create_reset_code(email, code):
    resetCode = {
        "email": email,
        "code": code
    }

    exists = reset_codes.find_one({'email': email})
    if exists:
        reset_codes.delete({'email':email})
        
    reset_codes.insert_one(resetCode)
    return resetCode

def get_one_reset_code(email):
    result = reset_codes.find_one({'email': email})
    return result

def update_password(email, password):
    users.update_one( 
        {"email": email},
        { "$set": {"password":password}}
    )

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
########################### Assignments ###########################
###################################################################

def fetch_assignments_by_user(user_id: str):
    cursor = assignments.find({})
    student_assignments = []
    for document in cursor:
        assignment = stringify_id(Assignment(**document))
        for individual_assignment in assignment.individual_assignments:
            if individual_assignment.studentid == user_id:
                student_assignments.append(assignment)
    return student_assignments

def submit_assignment(assignment_id: str, github_link: str, user_id: str):
    query = {
        "_id": ObjectId(assignment_id)
    }
    assignment = assignments.find_one(query)
    

    if assignment:
        individual_assignments = assignment["individual_assignments"]

        # Find an individual assignment in the object's individual_assignment list that has a given studentid
        for individual_assignment in individual_assignments:
            if individual_assignment["studentid"] == user_id:
                # Set the submitted field in that object to true
                individual_assignment["submitted"] = True

                # Set the github link in that assignment to a given string
                individual_assignment["submissionLink"] = github_link

        # Update the modified assignment in the collection
        assignments.update_one({"_id": assignment["_id"]}, {"$set": {"individual_assignments": individual_assignments}})
    

###################################################################
############################## Users ##############################
###################################################################

def update_user_by_id(user_id: str, user_data: UserIn):
    users.update_one({'_id': ObjectId(user_id)}, {"$set": user_data.dict()})

def validate_invite_request(invite_request: UserInviteRequest):
    users = fetch_filtered("Users", [("email", invite_request.email)])
    if len(users) > 0:
        return "user already exists"
    invites = fetch_filtered("UserInvites", [("email", invite_request.email)])
    if len(invites) > 0:
        return "user already exists"
    return "success"

def delete_invite_by_code(code: str):
    user_invites.delete_one({'accesscode': code})

def delete_user_by_id(id: str):
    users.delete_one({'_id': ObjectId(id)})

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