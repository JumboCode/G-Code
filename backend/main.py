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
from mangum import Mangum

# Mark
from bson import json_util, ObjectId
import json

from model import *
from database import *
from email_module import *

# Create app
app = FastAPI()
handler = Mangum(app)
load_dotenv()

# Used for encrypting session tokens
session_secret = os.environ["SECRET_SESSION_KEY"]
registration_secret = os.environ["SECRET_REGISTRATION_KEY"]

# Allow access from frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

################################################################################
############################### Authentication #################################
################################################################################

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

@app.post("/login")
def login(request: OAuth2PasswordRequestForm = Depends()):   
    user = fetch_user_by_email(request.username)

    if type(user) == str:
        raise HTTPException(status_code=403, detail="Invalid Username")
    
    if not Hash.verify(user.password, request.password):
        raise HTTPException(status_code=404, detail="wrong username or password")
        
    access_token = create_access_token(data={"email": user.email, "type": user.type})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/sendreset")
def send_reset(email: str):
    user = fetch_user_by_email(email)
    if not user:
        raise HTTPException(status_code=403, detail="Email Not Found")
    code = ''.join(random.choices(string.ascii_uppercase, k = 6))
    create_reset_code(email, code)
    msg = send_reset_email(code)
    send_email(msg, "GCode Reset Code", email)
    return True

@app.post("/resetpassword")
def reset_password(data: ResetDataIn):
    email = data.email
    code = data.code
    password = data.password

    reset_obj: ResetData = get_one_reset_code(email)
    if not reset_obj:
        raise HTTPException(status_code=403, \
                            detail="No password reset requested for this account.")

    true_code = reset_obj["code"]
    if (code != true_code):
        raise HTTPException(status_code=403, detail="Reset code does not match")
    
    hashedPW = Hash.bcrypt(password)
    update_password(email, hashedPW)

@app.post("/changepassword")
def post_change_password(data: ChangePassword, current_user: UserIn = Depends(get_current_user)):
    user = fetch_user_by_email(current_user.email)
    try:
        Hash.verify(user.password, data.currentpassword)
    except:
        raise HTTPException(status_code=403, detail="Incorrect password.")
    if data.newpassword != data.repeatnewpassword:
         raise HTTPException(status_code=403, detail="Passwords do not match.")
    change_password(user.id, Hash.bcrypt(data.newpassword))


###################################################################
########################### Appointment ###########################
###################################################################

@app.get("/api/one_appointment")
async def get_one_appointment(field_name: str, field_value: Any):
    response = fetch_one("Appointments", field_name, field_value)
    return response

@app.get("/api/appointments")
async def get_appointments(currentUser: UserIn = Depends(get_current_user)):
    response = fetch_appointments(currentUser.email)
    return response

@app.put("/api/put_appointment/")
async def put_appointment(appointment_data: Appointment):
    response = create_appointment(appointment_data.dict())
    return response 

@app.put("/api/assign_student_to_appoint/")
async def assign_student_to_appointment(appointmentID: str , studentID : str):
    response = reserve_appointment(appointmentID, studentID)   
    return response 

@app.put("/api/remove_student_from_appoint/")
async def remove_student_from_appointment(appointmentID: str, 
                                          user: dict = Depends(get_current_user)):
    if user.type != 'admin':
        raise HTTPException(status_code=403, detail="must be an admin to remove student")
    response = cancel_appointment(appointmentID)
    return response


################################################################################
################################## Assignments #################################
################################################################################

@app.get("/api/all_assignments")
async def get_assignments(currentUser: UserIn = Depends(get_current_user)):
    if (currentUser.type != 'admin'):
        raise HTTPException(status_code=403, detail='Must be admin to view all assignments')
    result = fetch_all("Assignments")
    return result

@app.post("/api/assignment")
async def post_assignment(assignment: AssignmentIn, 
                          currentUser: UserIn = Depends(get_current_user)):
    if currentUser.type != 'admin':
        raise HTTPException(status_code=403, detail='Must be admin to create assignments')
    # new_assignment = {**assignment.dict(), 'individual_assignments': []}
    for student in fetch_filtered("Users",[("type", "student")] ):
        individual_assignment = {
            'submitted': False,
            'studentid': student.id,
            'submissionLink': '',
            'messages': []
        }
        assignment.individual_assignments.append(individual_assignment)

    create_assignment(assignment)
        
    return "success"

@app.post("/api/assign_assignment")
async def assign_assignment (assignment_id: str, student_emails: list[str]):
    for email in student_emails:
        user = fetch_user_by_email(email)
        if user is None:
            error_message = ("A user with the email \"" + email +
                            "\" does not exist")
            raise HTTPException(status_code=500, detail=error_message)
        
        individual_assignment = {
            'submitted': False,
            'student_email': email,
            'github_link': '',
            'messages': []
        }
        create_individual_assignment(assignment_id, individual_assignment)
    return "success"

@app.get("/api/assignments")
async def get_assignments(currentUser: UserIn = Depends(get_current_user)):
    user = fetch_user_by_email(currentUser.email)
    result = fetch_assignments_by_user(user.id)
    return result

@app.get("/api/submit_assignment")
async def put_submit_assignment(assignment_id: str, 
                                github_link: str, 
                                currentUser: UserIn = Depends(get_current_user)):
    user = fetch_user_by_email(currentUser.email)
    submit_assignment(assignment_id, github_link, user.id)

@app.get("/api/assignment_by_id")
async def get_assignment_by_id(assignment_id: str, 
                               currentUser: UserIn = Depends(get_current_user)):
    user = fetch_user_by_email(currentUser.email)
    full_assignment = fetch_one("Assignments", "_id", ObjectId(assignment_id))
    if user.type == 'admin':
        return full_assignment
    user_assignment = None
    for individual_assignment in full_assignment.individual_assignments:
        if individual_assignment.studentid == user.id:
            user_assignment = individual_assignment
    return StudentAssignmentView(**full_assignment.dict(), individual_assignment=user_assignment)

@app.get("/api/current_assignments")
async def get_current_assignemtns(currentUser: UserIn = Depends(get_current_user)):
    user = fetch_user_by_email(currentUser.email)
    if user.type != 'admin':
        raise HTTPException(status_code=403, detail='Must be admin to access all assignments')
    return current_assignments()    

@app.get("/api/past_assignments")
async def get_past_assignments(currentUser: UserIn = Depends(get_current_user)):
    user = fetch_user_by_email(currentUser.email)
    if user.type != 'admin':
        raise HTTPException(status_code=403, detail='Must be admin to access all assignments')
    return past_assignments()    


################################################################################
################################# Appointments #################################
################################################################################

@app.post("/api/save_schedule")
def save_schedule(data: AppointmentSchedule, 
                  maxSessions: int, 
                  timeZone: str, 
                  currentUser: UserIn = Depends(get_current_user)):
    user = fetch_user_by_email(currentUser.email)
    if user.type != 'admin':
        raise HTTPException(status_code=403, detail='Must be admin to set appointment schedule')
    update_profile_field(currentUser.email, 'maxsessions', maxSessions)
    update_profile_field(currentUser.email, 'timezone', timeZone)
    set_schedule(data, user.id)
    return user

@app.put("/api/reserve_appointment")
async def reserve_appointment(appointment_data: AppointmentBookingIn,
                              current_user=Depends(get_current_user)):
    data_dict = appointment_data.dict()
    student_email = fetch_one("Users", "email", current_user.email).email
    data_dict["studentEmail"] = student_email
    create_appointment(data_dict)

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

@app.get("/api/get_available_appointments")
async def get_available_appointments(date: date):
    appointments_by_admin = dict()

    weekday = date.strftime('%A')
    
    print(str(date) + " is a " + str(weekday))

    admins = fetch_filtered("Users",[("type", "admin")])

    for admin in admins:
        appointments_by_admin[admin.email] = admin.appointment_schedule.dict()[weekday.lower()]

    # cross check with booked appointments
    # for each appointment, search for appointment by admin ID and time slot
        # if booking exists, remove from response
    appointments = fetch_all("Appointments")

    def does_appointment_exist(appointment, tutorEmail):
        print(appointment)
        for existing_appointment in appointments:
            hour = math.trunc(appointment['starttime'])
            minute = int(60 * (appointment['starttime'] - math.trunc(appointment['starttime'])))
            if (existing_appointment.tutorEmail == tutorEmail and 
                existing_appointment.startTime.date() == date and
                existing_appointment.startTime.time() == datetime.time(hour, minute)):
                return True
        return False

    for admin in appointments_by_admin:
        appointments_by_admin[admin] = list(filter(lambda app : not \
                                                   does_appointment_exist(appointment=app, 
                                                                          tutorEmail=admin), 
                                                                          appointments_by_admin[admin]))

    return appointments_by_admin

@app.put("/api/cancel-appointment")
async def cancel_appointment_by_id(id: str, current_user: UserIn = 
                            Depends(get_current_user)):
    cancel_appointment(id)
    return "ok"


################################################################################
################################## Users #######################################
################################################################################

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
async def post_user_invites(invite_requests: list[UserInviteRequest], 
                            currentUser: UserIn = Depends(get_current_user)):
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
            invite = create_student_invite(accessKey, 
                                           invite_request.email, 
                                           invite_request.acctype.lower(), 
                                           date)
            send_email(format_invite(invite), "{G}Code User Invite", invite_request.email)
    return validations  

@app.post("/api/join")
async def post_user_invite(user_data: UserIn, access_code: str):
    invite = fetch_one("UserInvites", "accesscode", access_code)
    if type(invite) == str:
        raise HTTPException(status_code=403, 
                            detail="Invite code not valid. Please enter a valid invite code.")
    user = fetch_one("Users", "email", user_data.email)
    if type(user) != str:
        raise HTTPException(status_code=403, 
                            detail="Email already exists. Please enter a valid email.")
    user_data.password = Hash.bcrypt(user_data.password)
    create_new_user({**user_data.dict(), 
                     'type':invite.acctype, 
                     'appointment_schedule': AppointmentSchedule().dict()})
    delete_invite_by_code(access_code)
    return "success"

@app.delete("/api/user")
async def delete_user(user_id: str, currentUser: UserIn = Depends(get_current_user)):
    if currentUser.type != 'admin':
        raise HTTPException(status_code=401, detail="Must be admin to delete users.")
    delete_user_by_id(user_id)
    return "success"

@app.get("/api/studentinvites")
async def get_studentinvites():
    response = fetch_filtered("UserInvites", [("acctype", "Student")])
    return response

@app.post("/api/edit_user_profile")
async def edit_user_profile (username: str, new_profile_values: dict, 
                             admin_user: dict = Depends(get_current_user)):
    user = fetch_user_by_email(username)
    if user == None: 
        raise HTTPException(status_code=403, detail="Invalid Username")
    elif user.type == "admin":
        user["permission_level"] = "Admin"
        editable_fields = ["firstname", "lastname", "email", "password", \
                           "timzone", "linkedin", "pronouns", "bio", "github", "zoom", "maxsessions"]
    else:
        user["permission_level"] = "Student"
        editable_fields = ["firstname", "lastname", "email", "password", \
                            "timzone", "linkedin", "pronouns", "bio", "github"]

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


################################################################################
#################################### Posts #####################################
################################################################################

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

@app.get("/api/questions")
async def get_questions():
    response = fetch_all_posts_sorted()
    return response