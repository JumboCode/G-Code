'''
main.py
Purpose: Creates server and all routes for G-Code backend.
Authors: G-Code Jumbocode Team
'''

import random
import string
import os
import re
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from hashing import Hash
from jwttoken import create_access_token
from oauth import get_current_user
from datetime import datetime, timezone, timedelta, date
import datetime, time
# from http.client import HTTPException
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Mark
from bson import json_util, ObjectId
import json

from model import *
from database import *
from email_module import *

# Create app
app = FastAPI()
load_dotenv()

# Used for encrypting session tokens
session_secret = os.environ["SECRET_SESSION_KEY"]
registration_secret = os.environ["SECRET_REGISTRATION_KEY"]

# Allow access from frontend
# origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root(current_user: UserIn = Depends(get_current_user)):
    '''
    Purpose: Demo route to test if database is running.
    '''
    user = fetch_user_by_email(current_user.email)
    if user == None:
        raise HTTPException(status_code=403, detail="User Not Found")
    del user["password"]
    return user

@app.post("/register_student")
def register_student(postData: dict):
    email = postData.get('email')

    new_user = UserIn(
    firstname = postData.get('firstName'),
    lastname = postData.get('lastName'),
    email = email,
    password = Hash.bcrypt(postData.get('password')),
    type = "student"
    )

    user = fetch_user_by_email(email)

    if user: 
        raise HTTPException(status_code=403, detail="User Already Exists")
    else:
        create_new_user(dict(new_user))
        return 'ok'

@app.post("/login")
def login(request: OAuth2PasswordRequestForm = Depends()):   
    user = fetch_user_by_email(request.username)

    if not user:
        raise HTTPException(status_code=403, detail="Invalid Username")

    if not Hash.verify(user["password"], request.password):
        raise HTTPException(status_code=404, detail="wrong username or password")
    
    access_token = create_access_token(data={"email": user["email"], "type": user["type"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/send_appt_reminder")
def send_appt_reminder(appt: Appointment):
    if (appt == None):
        raise HTTPException(status_code=403, detail="Appointment is null")
    
    tutor: UserIn = fetch_user_by_email(appt.tutorEmail)
    student: UserIn = fetch_user_by_email(appt.studentEmail)
    start: datetime = appt.startTime

    if (tutor == None):
        raise HTTPException(status_code=403, detail="Tutor email doesn't match existing user")
    if (student == None):
        raise HTTPException(status_code=403, detail="Student email doesn't match existing user")

    tutor_msg = format_appt_reminder(tutor.firstname, start)
    student_msg = format_appt_reminder(student.firstname, start)
    
    send_email(tutor_msg, "{G}Code Appointment Reminder", tutor.email)
    send_email(student_msg, "{G}Code Appointment Reminder", student.email)


@app.post("/call_send_appt")
def call_send_appt():
    appt: Appointment = fetch_one("Appointments", "tutorEmail", "theseus.lim@gmail.com")
    send_appt_reminder(appt)

@app.post("/registration")
def registration(request: UserIn):
    # Check if email from request is in invites w/ the same first and last name
    corr_invite = get_one_invite("Email", request["email"])
    if not corr_invite:
        raise HTTPException(status_code=403, detail="Email Not Invited")
    if not corr_invite["firstname"] == request["firstname"]:
        raise HTTPException(status_code=403, detail="First Name Does Not Match")
    if not corr_invite["lastname"] == request["lastname"]:
        raise HTTPException(status_code=403, detail="Last Name Does Not Match")
    zoomlink = request["zoom"]
    pattern = re.compile(r'^https?:\/\/(?:www\.)?(?:zoom\.us|zoomgov\.com)\/(?:j|my)\/([a-zA-Z0-9-_]{10,})$', re.IGNORECASE)
    if not pattern.match(zoomlink):
       raise HTTPException(status_code=403, detail="Invalid Zoom Link") 
    remove_student_invite(request.accesscode)
    create_new_user(request.dict())
    return

############################################################################
# Routes to Get All Of a DB Collection
# TODO: For students/admins, filter out passwords / other sensitive info
# TODO: Add HTTP Error checking

@app.post("/api/save_schedule")
def save_schedule(data: dict):
    email = data.get('email')
    user = fetch_user_by_email(email)
    set_schedule(data)
    return user

@app.get("/api/students")
async def get_students():
    response = fetch_filtered("Users",[("type", "student")] )
    return response

@app.get("/api/admins")
async def get_admins():
    response = fetch_all("Admins")
    return response

@app.get("/api/appointments")
async def get_appointments():
    response = fetch_all("Appointments")
    return response

@app.get("/api/assignments")
async def get_assignments():
    response = fetch_all("Assignments")
    return response

@app.get("/api/appointments3")
async def get_3_appointments(currentUser: UserIn = Depends(get_current_user)):
    print("Printing Current User Email: " + currentUser.email)
    response = fetch3Appointments(currentUser.email)
    return response

@app.get("/api/questions")
async def get_questions():
    response = fetch_all("Questions")


    print(response)
    # response = []
    return response

# @app.get("/api/questions_two")
# async def get_question_two():
#     response = fetch_all("Questions")
#     return response

@app.get("/api/studentinvites")
async def get_studentinvites():
    response = fetch_filtered("UserInvites", [("acctype", "Student")])
    return response

@app.get("/api/admininvites")
async def get_admininvites():
    response = fetch_all("AdminInvites")
    return response
###########################################################################



###########################################################################
# Routes to Get One Item From a DB Collection
# TODO: For certain requests, check if user is allowed to make the get request, and return "Access Denied" if not
# TODO: Handle "No Result Found" or "Multiple Instances Found"

@app.get("/api/one_student")
async def get_one_student(field_name: str, field_value: Any):
    response = fetch_one("Students", field_name, field_value)
    return response

def create_one (model_class: str, to_add):
    db = db_dic[model_class]
    if isinstance(to_add, model_dic[model_class]):
        db.insert_one(to_add.dict())
    else:
        raise Exception("The given object was not an instance of the given model_class")

@app.post("/api/create_assignment")
async def create_assignment (new_assignment: Assignment):
    if (new_assignment.indivdualAssignments == None):
        new_assignment.individualAssignments = []
    response = create_one("Assignments", new_assignment)
    return response

@app.post("/api/assign_assignment")
async def assign_assignment (assignment_id: str, student_emails: list[str]):
    for email in student_emails:
        print("IN STUDENT EMAILS LOOP")
        user = fetch_user_by_email(email)
        if user is None:
            error_message = ("A user with the email \"" + email + "\" does not exist")
            raise HTTPException(status_code=500, detail=error_message)
        individual_assignment = {
            'submitted': False,
            'student_email': email,
            'messages': []
        }
        create_individual_assignment(assignment_id, individual_assignment)
    return "success"

@app.get("/api/get_student_assignments")
async def get_student_assignments(student_email : str):
   return get_all_student_assignments(student_email)

@app.get("/api/one_admin")
async def get_one_admin(field_name: str, field_value: Any):
    response = fetch_one("Admins", field_name, field_value)
    return response

@app.get("/api/one_appointment")
async def get_one_appointment(field_name: str, field_value: Any):
    response = fetch_one("Appointments", field_name, field_value)
    return response

@app.get("/api/one_question")
async def get_one_question(field_name: str, field_value: Any):
    response = fetch_one("Questions", field_name, field_value).dict()
    # Prevents TypeError("'ObjectId' object is not iterable")
    response['id'] = str(response['id'])
    return response

@app.get("/api/get_question_by_id")
async def get_question_by_id (id_string: str):
    response = fetch_one("Questions", "_id", ObjectId(id_string)).dict()
    # Prevents TypeError("'ObjectId' object is not iterable")
    response['id'] = str(response['id'])
    return response

@app.get("/api/one_invite")
async def get_one_invite(field_name: str, field_value: Any):
    response = fetch_one("Invites", field_name, field_value)
    return response
##########################################################################


##########################################################################


@app.get("/api/get_student_assignments")
async def get_student_assignments(student_email : str):
   return get_all_student_assignments(student_email)

@app.post("/api/create_assignment")
async def create_assignment (new_assignment: Assignment):
    '''
    Purpose: Add a question to the database

    Input: A question object
    '''
    response = create_one("Assignments", new_assignment)
    return response

@app.post("/api/assign_assignment")
async def assign_assignment (assignment_id: str, student_emails: list[str]):
    '''
    Purpose: Add a question to the database

    Input: A question object
    '''

    for email in student_emails:
        print("IN STUDENT EMAILS LOOP")
        user = fetch_user_by_email(email)
        if user is None:
            error_message = ("A user with the email \"" + new_user["email"] +
                            "\" does not exist")
            raise HTTPException(status_code=500, detail=error_message)
        
        individual_assignment = {
            'submitted': False,
            'student_email': email,
            'messages': []
        }
        create_individual_assignment(assignment_id, individual_assignment)

    return "success"

@app.post("/api/create_question")
async def create_question (request: QuestionIn):
    '''
    Purpose: Add a question to the database

    Input: A question object
    '''
    response = add_question(request.dict())

    return "success"

@app.post("/api/respond_to_question")
async def respond_to_question (question_reply: QuestionReply):
# async def respond_to_question (question_title : str, reply: Reply):
    '''
    Purpose: Add a question to the database

    Input: A question object
    '''

    question_title = question_reply.question_name
    reply = question_reply.reply
    response = add_reply_to_question(question_title, reply.dict())
    return "success"

# Routes to Get All Items From a DB Collection With Multiple Filters
@app.get("/api/filter_students")
async def get_filtered_students(filters: list[tuple]):
    response = fetch_filtered("Students", filters)
    return response

# Get appointments (TODO: should this be a get not a put?)
@app.put("/api/filtered_appointments")
async def get_filtered_appointments(filter: list[tuple]):
    '''
    Purpose: Filters all available appointments based on the filters the student
            wants

    Input:  List of tuples which contains the category and the preference
    '''
    response = fetch_filtered("Appointments", filter)
    return response

@app.put("/api/cancel-appointment")
async def cancel_appointment_by_id(id: str, current_user: UserIn = 
                            Depends(get_current_user)):
    cancel_appointment(id)
    return "ok"


# Send request for new user
@app.put("/api/request_student")
async def put_student_request(email: str):
    '''
    Purpose: Generates an access code for a student and stores the code as well
             as the student's information and the datetime they were added
             in the student requests document of the database.

    Input:   For now just the students email address. We will also require
             an authentication token of some sort once that is set up.
    '''
    accessKey = ''.join(random.choices(string.ascii_uppercase, k = 6))
    date = datetime.now()
    create_student_invite(accessKey, email, date)
    
# Requuest multiple users at the same time

# Lets student join/register
@app.put("/api/student_join")
async def put_student_join(access_token: str, student_data: User):
    '''
    Purpose: Verifies that access token that was added is valid and then
             adds the student with all of their data into the database.

    Input:   An access token, which is a string. Also the student's data,
             as specified by the model.
    '''
    studentFromKey = fetch_one_invite(access_token)
    if studentFromKey:
        # await create_student(student_data)
        # raise HTTPException(404, f"there are no students with this key")
        s = create_student(student_data.dict())
        remove_student_invite(access_token)
        return s
    else:
        return HTTPException("Student was not created")

# Add new appt to database
@app.put("/api/put_appointment/")
async def put_appointment(appointment_data: Appointment):
    response = create_appointment(appointment_data.dict())
    return response 

@app.put("/api/assign_student_to_appoint/")
async def assign_student_to_appointment(appointmentID: str , studentID : str):
    '''
    Purpose: updates an appointment by linking it to the student reserving the appointment, 
             and marks as reserved 
    
    Input: The appointment ID, and the ID of the student registering 
    '''
    response = reserve_appointment(appointmentID, studentID)   
    return response 

@app.put("/api/remove_student_from_appoint/")
async def remove_student_from_appointment(appointmentID: str, user: dict = Depends(get_current_user)):
    '''
    Purpose: If there are more than 24 before the appointment, update the apppointment 
            by removing the student cancel and unmark as reserved

    Input: the appointment ID to mark as unreserved 
    '''
    if user.type != 'admin':
        raise HTTPException(status_code=403, detail="must be an admin to remove student")
    response = cancel_appointment(appointmentID)
    return response 

@app.put("/api/assign_student_to_class/")
async def assign_student_to_class (username : str, class_name : str, 
                                   user: dict = Depends(get_current_user)):
    '''
    Purpose: Allows the admin to create a new student and add them to a class

    Input: the student name, and the class name to assign them to
    '''
    if user.type != 'admin':
        raise HTTPException(status_code=403, detail="must be an admin to assign student")
    student = fetch_student_by_username(username)
    if student is None:
        raise HTTPException(status_code=500, 
                            detail="The given student does not exist")
    add_student_to_class(class_name, student)

@app.put("/api/unassign_student_from_class/")
async def unassign_student_to_class (username : str, class_name : str, 
                                   user: dict = Depends(get_current_user)):
    '''
    Purpose: Allows the admin to create a new student and add them to a class

    Input: the student name, and the class name to assign them to
    '''
    if user.type != 'admin':
        raise HTTPException(status_code=403, detail="must be an admin to unassign student")
    student = fetch_student_by_username(username)
    if student is None:
        raise HTTPException(status_code=500, 
                            detail="The given student does not exist")
    remove_student_from_class(class_name, student)

@app.put("/api/assign_instructor_to_class/")
async def assign_instructor_to_class (username : str, class_name : str, 
                                      user: dict = Depends(get_current_user)):
    '''
    Purpose: Allows the admin to create a new student and add them to a class

    Input: the student name, and the class name to assign them to
    '''
    if user.type != 'admin':
        raise HTTPException(status_code=403, detail="must be an admin to assign instructor")
    instructor = fetch_admin_by_username(username)
    if instructor is None:
        raise HTTPException(status_code=500, 
                            detail="The given instructor does not exist")
    add_instructor_to_class(class_name, instructor)

@app.put("/api/unassign_instructor_from_class/")
async def unassign_instructor_from_class (username : str, class_name : str, 
                                          user: dict = Depends(get_current_user)):
    '''
    Purpose: Allows the admin to create a new student and add them to a class

    Input: the student name, and the class name to assign them to
    '''
    if user.type != 'admin':
        raise HTTPException(status_code=403, detail="must be an admin to unassign instructor")
    instructor = fetch_admin_by_username(username)
    if instructor is None:
        raise HTTPException(status_code=500, 
                            detail="The given instructor does not exist")
    remove_instructor_from_class(class_name, instructor)

@app.get("/api/view_students_in_class/")
async def view_students_in_class (class_name : str, 
                                  user: dict = Depends(get_current_user)):
    # Conversion to string must be done because student documents may have an
    # 'ObjectId' field, which is non-iterable and will result in a type-error 
    # if returned directly
    return  str(get_all_students_in_class(class_name))

@app.get("/api/view_instructors_in_class/")
async def view_instructors_in_class (class_name : str, 
                                     user: dict = Depends(get_current_user)):
    return str(get_all_instructors_in_class(class_name))

@app.post("/api/edit_user_profile")
async def edit_user_profile (username: str, new_profile_values: dict, 
                             admin_user: dict = Depends(get_current_user)):
    student = fetch_student_by_username(username)
    admin = fetch_admin_by_username(username)   

    # TODO - automatically insert permission level when fetching all users, 
    #        will simplify code
    if student != None:
        user = student
        user["permission_level"] = "Student"
        editable_fields = ["firstname", "lastname", "email", "mentorid"]
    elif admin != None:
        user = admin
        user["permission_level"] = "Admin"
        editable_fields = ["classes", "mentees"]
    else:
        raise HTTPException(
            status_code=403, detail="Invalid Username"
        )
    
    for field in new_profile_values:
        if field not in editable_fields:
            raise HTTPException(status_code=500, 
                            detail =  ("The " + field 
                                       + " cannot be edited"))
        update_profile_field(username, user["permission_level"], 
                             field, new_profile_values[field])


@app.post("/api/edit_own_profile")
async def student_profile_self_view (new_profile_values: dict, 
                                     user: dict = Depends(get_current_user)):
    uneditable_fields = ["emailverified", "mentorid", "accepted_registration"]
    username = user["username"]
    for field in new_profile_values:
        if field in uneditable_fields:
            raise HTTPException(status_code=500, 
                            detail =  ("The " + field 
                                       + " cannot be edited by students"))
        update_profile_field(username, user["permission_level"], 
                             field, new_profile_values[field])

@app.post("/api/create_invites/")
async def create_users (new_users: list):
    print("IN CREATE USERS")
    print(type(new_users))
    for new_user in new_users:
        print(type(new_user))
        print("Adding new user!")
        if fetch_user_by_email(new_user["email"]) != None:
            error_message = ("A user with the email \"" + new_user["email"] +
                            "\" already exists")
            raise HTTPException(status_code=500, detail=error_message)

        access_code = str(hash((new_user["email"], registration_secret)))
        today = date.today().isoformat()

        ## TODO: Student and Admin models require a lot of temporary placeholder 
        # values, should these be required?
        user_invite = {
            "accesscode": access_code,
            "requestdate": today,
            "email": new_user["email"],
            "firstname": new_user["firstname"],
            "lastname": new_user["lastname"],
            "acctype": new_user["acctype"]
        }
        create_user_invite(user_invite)


def sent_invite_email(to_contact: User):
    student_id = fetch_student_by_username(to_contact.username)['_id']
    message = Mail(
        from_email = 'jumbo.g.code@gmail.com',
        to_emails = to_contact.email,
        subject = 'G-Code Invitation',
        # TODO: Switch URL in html_content from localhost to actual url
        html_content = '<div> <p>You\'ve been invited to join G-Code\'s course' 
                        'page! Please click the following link: </p>'
                        '<a href=\'http://localhost:3000/' + str(student_id) + 
                        '\'> Sign-Up </a> </div>'
   )
    try:
        sg = SendGridAPIClient(os.environ["SENDGRID_API_KEY"])
        response = sg.send(message)
    except Exception as e:
        print(e.message)

@app.get("/api/posts")
async def get_posts():
    response = fetch_all_posts()
    return response

@app.put("/api/posts")
async def put_post(post_data: Post):
    '''
    Purpose: Add a post to the database

    Input: A post object
    '''
    response = create_post(post_data.dict())
    return response 

@app.put("/api/postreply")
async def put_reply(post_ID: str, reply_data: Reply):
    '''
    Purpose: Add a reply to a post in the database

    Input: A reply data object and a post id string
    '''
    response = add_reply(post_ID, reply_data.dict())
    return response
