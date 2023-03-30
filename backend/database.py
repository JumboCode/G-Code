'''
database.py
Purpose: Connects to the database and provides all functionality for accessing
         data from the database.
'''

from pymongo import MongoClient
from dotenv import load_dotenv
from model import UserModel, UserInviteModel, AppointmentModel, AssignmentModel, PostModel, UserInModel
from hashing import Hash
from datetime import datetime, timedelta
from bson.objectid import ObjectId
import os

# load enviornment variables
load_dotenv()

# Connect to database
uri          = os.environ["MONGO_DB_URI"]
client       = MongoClient(uri, 8000)
database     = client.db

# Extract collections
users        = database.users
user_invites = database.user_invites
assignments  = database.assignments
appointments = database.appointments
posts        = database.posts
classes      = database.classes
sessions     = database.sessions


def stringify_object_id(document):
    document.id = str(document.id)
    return document

def fetch_all_users():
    student_list = []
    cursor = users.find({})
    for document in cursor:
        student_list.append(stringify_object_id(UserModel(**document)))
    return student_list

def fetch_all_user_invites():
    student_invites = []
    cursor = user_invites.find({})
    for document in cursor:
        student_invites.append(UserInviteModel(**document))
    return student_invites

def fetch_one_user_invite(access_code: str):
    document = user_invites.find_one({"accesscode": access_code})
    return document

def create_new_user(user: UserInModel):
    hashed_password = Hash.bcrypt(user.password)
    user_object = dict(user)
    user_object["password"] = hashed_password
    users.insert_one(user_object)

def team_accounts():
    firstnames = ["Theseus", "Jimmy", "Emma", "Elizabeth", "Sean", "Aidan", "Kimaya", "Jyoti", "Ruby", "Sarah", "Megan"]
    lastnames = ["L", "M", "P", "F", "R", "B", "W", "B", "M", "G", "Y"]
    for i in range(11):
        this_user: UserInModel() 
        this_user.firstname = firstnames[i]
        this_user.lastname = lastnames[i]
        this_user.email = firstnames[i]
        this_user.password = firstnames[i]
        # this_user.username = firstnames[i]

        create_new_user(this_user)

def fetch_session_by_username(username):
    return sessions.find_one({"username": username})

def fetch_user_by_email(email):
    user = users.find_one({"email": email})
    return stringify_object_id(UserModel(**user))

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

def create_user_invite(access_code: str, email: str, request_date: str):
    inviteToAdd = {
        "accesscode": access_code,
        "requestdate": request_date,
        "email": email
    }
    user_invites.insert_one(inviteToAdd) 
    return inviteToAdd

def remove_user_invite(ak):
    user_invites.delete_one({"accesscode": ak})
    return True

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

def fetch_filtered_appointments(filters):
    filter_dict = {"reserved" : False}

    for fil in filters:
        filter_dict.update({fil[0]:fil[1]})
    
    appt_list = []
    cursor = appointments.find(filter_dict)
    print (cursor)
    for document in cursor:
        print(document)
        appt_list.append(AppointmentModel(**document))
    return appt_list

def get_assignments_by_assignment_id(assignmentid):
    cursor = assignments.find({"assignmentid": assignmentid})
    assignment_list = []
    for document in cursor:
        assignment_list.append(AssignmentModel(**document))
    return assignment_list

def get_assignments_by_student_id(studentid):
    cursor = assignments.find({"studentid": studentid})
    assignment_list = []
    for document in cursor:
        assignment_list.append(AssignmentModel(**document))
    return assignment_list

def fetch_all_posts():
    '''
    Purpose: Returns all questions stored in the database
    '''
    questions_list = []
    cursor = posts.find({})
    for document in cursor:
        questions_list.append(PostModel(**document))
    return questions_list

def add_student_to_class (class_name, student):
    classes.update_one({'name': class_name}, {'$addToSet': {'students': student}})

def remove_student_from_class (class_name, student):
    classes.update_one({'name': class_name}, {'$pull': {'students': student}})

def add_instructor_to_class (class_name, instructor):
    classes.update_one({'name': class_name}, {'$addToSet': {'instructors': instructor}})

def remove_instructor_from_class (class_name, instructor):
    classes.update_one({'name': class_name}, {'$pull': {'instructors': instructor}})

def get_all_students_in_class (class_name):
    return classes.find_one({"name": class_name}, {"students": 1, "_id": 0})

def get_all_instructors_in_class (class_name):
    classes.find({"name": class_name}, {"instructors": 1, "_id": 0})

def update_profile_field (username, permission_level, field_name, new_value):
    if permission_level == "Student":
        users.update_one({'username': username}, {"$set": {field_name: new_value}})
    else:
        users.update_one({'username': username}, {"$set": {field_name: new_value}})