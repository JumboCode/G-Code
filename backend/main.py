'''
main.py
Purpose: Creates server and all routes for G-Code backend.
Authors: G-Code Jumbocode Team
'''

import random
import string
import os
import math
import re
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from hashing import Hash
from jwttoken import create_access_token
from oauth import get_current_user
from datetime import datetime, date, time
# from http.client import HTTPException
from dotenv import load_dotenv

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
    del user.password
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

    if type(user) == str:
        raise HTTPException(status_code=403, detail="Invalid Username")

    if not Hash.verify(user.password, request.password):
        raise HTTPException(status_code=404, detail="wrong username or password")
    
    access_token = create_access_token(data={"email": user.email, "type": user.type})
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


@app.get("/api/admins")
async def get_admins():
    response = fetch_all("Admins")
    return response

@app.get("/api/questions")
async def get_questions():
    response = fetch_all_posts_sorted()
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

def create_one(model_class: str, to_add):
    db = db_dic[model_class]
    if isinstance(to_add, model_dic[model_class]):
        return db.insert_one(to_add.dict())
    else:
        raise Exception("The given object was not an instance of the given model_class")

@app.post("/api/create_assignment")
async def create_assignment(assignment: Assignment):
    print(assignment)
    response = create_one("Assignments", assignment)
    newID = response.inserted_id

    users = fetch_all("Users")
    emails = []
    for user in users:
        if user["type"] == "student":
            emails.append(user["email"])

    assign_assignment(newID, emails)

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
            'submissionLink': "",
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
            error_message = ("A user with the email \"" + email +
                            "\" does not exist")
            raise HTTPException(status_code=500, detail=error_message)
        
        individual_assignment = {
            'submitted': False,
            'student_email': email,
            'messages': []
        }
        create_individual_assignment(assignment_id, individual_assignment)

    return "success"

# @app.post("/api/create_question")
# async def create_question (request: PostIn):
#     '''
#     Purpose: Add a question to the database

#     Input: A question object
#     '''
#     response = add_question(request.dict())

#     return "success"

@app.post("/api/respond_to_question")
async def respond_to_question (question_reply: Reply):
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

# @app.get("/api/view_instructors_in_class/")
# async def view_instructors_in_class (class_name : str, 
#                                      user: dict = Depends(get_current_user)):
#     return str(get_all_instructors_in_class(class_name))

@app.post("/api/edit_user_profile")
async def edit_user_profile (username: str, new_profile_values: dict, 
                             admin_user: dict = Depends(get_current_user)):
    user = fetch_user_by_email(username)
    if user == None: 
        raise HTTPException(status_code=403, detail="Invalid Username")
    elif user.type == "admin":
        user["permission_level"] = "Admin"
        editable_fields = ["firstname", "lastname", "email", "password", "timzone", "linkedin", "pronouns", "bio", "github", "zoom", "maxsessions"]
    else:
        user["permission_level"] = "Student"
        editable_fields = ["firstname", "lastname", "email", "password", "timzone", "linkedin", "pronouns", "bio", "github"]

    for field in new_profile_values:
        if field not in editable_fields:
            raise HTTPException(status_code=500, detail =  ("The field " + field + " cannot be edited"))
        else:
            update_profile_field(user.email, field, new_profile_values[field])


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

# Appointment routes

@app.get("/api/appointments")
async def get_appointments():
    response = fetch_all("Appointments")
    return response

@app.get("/api/one_appointment")
async def get_one_appointment(field_name: str, field_value: Any):
    response = fetch_one("Appointments", field_name, field_value)
    return response

# TODO: don't limit to 3
@app.get("/api/appointments3")
async def get_3_appointments(currentUser: UserIn = Depends(get_current_user)):
    response = fetch3Appointments(currentUser.email)
    return response

# done
@app.put("/api/cancel-appointment")
async def cancel_appointment_by_id(id: str, current_user: UserIn = 
                            Depends(get_current_user)):
    cancel_appointment(id)
    return "ok"

@app.put("/api/put_appointment/")
async def put_appointment(appointment_data: Appointment):
    response = create_appointment(appointment_data.dict())
    return response 

@app.put("/api/assign_student_to_appoint/")
async def assign_student_to_appointment(appointmentID: str , studentID : str):
    response = reserve_appointment(appointmentID, studentID)   
    return response 

@app.put("/api/reserve_appointment")
async def reserve_appointment(appointment_data: AppointmentBookingIn,
                              current_user=Depends(get_current_user)):
    data_dict = appointment_data.dict()
    student_email = fetch_one("Users", "email", current_user.email).email
    data_dict["studentEmail"] = student_email
    create_appointment(data_dict)

@app.get("/api/get_available_appointments")
async def get_available_appointments(date: date):
    appointments_by_admin = dict()

    weekday = date.strftime('%A')
    
    print(str(date) + " is a " + str(weekday))

    admins = fetch_filtered("Users",[("type", "admin")])

    for admin in admins:
        appointments_by_admin[admin.email] = []
        if admin.appointment_slots:
            for appointment_slot in admin.appointment_slots:
                if appointment_slot.weekday == weekday:
                    appointments_by_admin[admin.email].append(appointment_slot)


    # cross check with booked appointments
    # for each appointment, search for appointment by admin ID and time slot
        # if booking exists, remove from response
    appointments = fetch_all("Appointments")

    def does_appointment_exist(appointment, tutorEmail):
        for existing_appointment in appointments:
            hour = math.trunc(appointment.start_time)
            minute = int(60 * (appointment.start_time - math.trunc(appointment.start_time)))
            if (existing_appointment.tutorEmail == tutorEmail and 
                existing_appointment.startTime.date() == date and
                existing_appointment.startTime.time() == datetime.time(hour, minute)):
                return True
        return False

    for admin in appointments_by_admin:
        appointments_by_admin[admin] = list(filter(lambda app : not does_appointment_exist(appointment=app, tutorEmail=admin), appointments_by_admin[admin]))

    return appointments_by_admin

@app.get("/api/assignments")
async def get_assignments():
    response = fetch_all("Assignments")
    return response

###################################################################
############################## Users ##############################
###################################################################

@app.get("/api/students")
async def get_students():
    response = fetch_filtered("Users",[("type", "student")] )
    return response

@app.get("/api/admins")
async def get_admins():
    response = fetch_filtered("Users",[("type", "admin")] )
    return response

@app.get("/api/users")
async def get_users():
    response = fetch_all("Users")
    return response

@app.put("/api/user_by_id")
async def put_user_by_id(user_data: UserUpdate, currentUser: UserIn = Depends(get_current_user)):
    currentUserID = fetch_one("Users", "email", currentUser.email).id
    update_user_by_id(currentUserID, user_data)
    result = fetch_one("Users", "_id", ObjectId(currentUserID))
    return result

@app.get("/api/user_by_id")
async def get_user_by_id(user_id: str):
    result = fetch_one("Users", "_id", ObjectId(user_id))
    return result

@app.post("/api/user_invites")
async def post_user_invites(invite_requests: list[UserInviteRequest], currentUser: UserIn = Depends(get_current_user)):
    if currentUser.type != 'admin':
        return "you must be an admin to invite users"
    validations = []
    valid = True
    for invite_request in invite_requests:
        validation = validate_invite_request(invite_request)
        if validation != "success":
            valid = False
        validations.append(validation)
    if valid:
        for invite_request in invite_requests:
            accessKey = ''.join(random.choices(string.ascii_uppercase, k = 6))
            date = datetime.datetime.now()
            invite = create_student_invite(accessKey, invite_request.email, invite_request.acctype.lower(), date)
            send_email(format_invite(invite), "{G}Code User Invite", invite_request.email)
    return validations
    

@app.post("/api/join")
async def post_user_invite(user_data: UserIn, access_code: str):
    invite = fetch_one("UserInvites", "accesscode", access_code)
    if type(invite) == str:
        raise HTTPException(status_code=403, detail="Invite code not valid. Please enter a valid invite code.")
    user = fetch_one("Users", "email", user_data.email)
    if type(user) != str:
        raise HTTPException(status_code=403, detail="Email already exists. Please enter a valid email.")
    user_data.password = Hash.bcrypt(user_data.password)
    create_new_user({**user_data.dict(), 'type':invite.acctype, 'appointment_schedule': AppointmentSchedule().dict()})
    delete_invite_by_code(access_code)
    return "success"

@app.delete("/api/user")
async def delete_user(user_id: str, currentUser: UserIn = Depends(get_current_user)):
    if currentUser.type != 'admin':
        raise HTTPException(status_code=401, detail="Must be admin to delete users.")
    delete_user_by_id(user_id)
    return "success"

###################################################################
############################## Posts ##############################
###################################################################

@app.get("/api/posts")
async def get_posts():
    response = fetch_all_posts_sorted()
    return response

@app.post("/api/create_post")
async def post_create_post(post_data: PostIn, currentUser: UserIn = Depends(get_current_user)):
    id = fetch_filtered('Users', [('email', currentUser.email)])[0].id
    response = insert_post(post_data.dict(), id, datetime.datetime.now())
    return response 

@app.post("/api/reply_to_post")
async def post_reply_to_post(post_ID: str, reply_data: ReplyIn, currentUser: UserIn = Depends(get_current_user)):
    id = fetch_filtered('Users', [('email', currentUser.email)])[0].id
    reply = Reply(body=reply_data.body, date=datetime.datetime.now(), author_id=str(id))
    response = add_reply(post_ID, reply)
    return response

@app.get("/api/post_by_id")
async def get_post_by_id (id_string: str):
    response = fetch_one("Posts", "_id", ObjectId(id_string)).dict()
    response['id'] = str(response['id'])
    return response