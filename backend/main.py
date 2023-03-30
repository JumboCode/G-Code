'''
main.py
Purpose: Creates server and all routes for G-Code backend.
Authors: G-Code Jumbocode Team
'''

import random
import string
from datetime import datetime, date

from fastapi import FastAPI, status, HTTPException
import os
from fastapi import FastAPI, Response, Request, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from model import UserModel, UserInModel, AppointmentModel
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import jwt
import bcrypt
from database import *
from datetime import datetime
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Create app
app = FastAPI()
load_dotenv()

# Used for encrypting session tokens
session_secret = os.environ["SECRET_SESSION_KEY"]
registration_secret = os.environ["SECRET_REGISTRATION_KEY"]

# Import functions from database.py
from database import (
    fetch_all_users,
    fetch_user_by_email,
    fetch_all_posts,
    add_student_to_class, 
    remove_student_from_class, 
    add_instructor_to_class, 
    remove_instructor_from_class, 
    get_all_students_in_class,
    get_all_instructors_in_class,
    update_profile_field,
    fetch_filtered_appointments
)

# Allow access from frontend
origins = ['http://localhost:3000']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

################################################################################

from oauth import get_current_user
from hashing import Hash
from jwttoken import create_access_token

@app.get("/")
async def read_root(current_user: UserModel = Depends(get_current_user)):
    '''
    Purpose: Demo route to test if database is running.
    '''
    return {"message" : "Hello, World!"}


@app.post("/login")
def login(request: OAuth2PasswordRequestForm = Depends()):    
    print(request.username)
    user = fetch_user_by_email(request.username)
    print(user)

    if not user:
        raise HTTPException(status_code=403, detail="Invalid Username")

    if not Hash.verify(user["password"], request.password):
        raise HTTPException(status_code=404, detail="wrong username or password")
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

    # If the user trying to log-in already has an active session, it's removed
    # so that duplicate session data will not be created
    # if fetch_session_by_username(username) != None:
    #     remove_session(username)
    #     response.delete_cookie("gcode-session")

    # Passing timezone.utc to the datetime.now() call that's used in add_session
    # is necessary for the time-to-live index in the MongoDB database to work,
    # which automatically removes sessions from the database after 4 hours
    # add_session(username, user_type, datetime.now(timezone.utc))

    # payload = {
    #             'sub': username,
    #             'exp': datetime.now(timezone.utc) + timedelta(hours=4),
    #             'iat': datetime.now(timezone.utc),
    #         }
    # token = jwt.encode(payload, session_secret, algorithm='HS256')
    # response.set_cookie("gcode-session", token)
    # return {"ok": True}

@app.post("/create_user")
def create_user(user: UserInModel):
    create_new_user(user)

@app.get("/me", response_model=UserModel)
def get_self(current_user = Depends(get_current_user)):
    return fetch_user_by_email(current_user.email)

################################################################################

@app.get("/login")
def login_page():
    return HTMLResponse(
        """
        <form action="/login" method="post">
        Username: <input type="text" name="username" required>
        <br>
        Password: <input type="password" name="password" required>
        <input type="submit" value="Login">
        </form>
        """
)

@app.get("/validate")
def validate_session(request: Request):
    '''
    Purpose: Checks that a user's session token is valid
    '''
    # An invalid user has no permission level
    user = {"permission_level": "None"}
    try:
        if "gcode-session" in request.cookies:
            decoded_token = jwt.decode(request.cookies["gcode-session"], 
                                    session_secret, 
                                    algorithms="HS256")
            username = decoded_token["sub"]
            session = fetch_session_by_username(username)
            if session != None:
                user = fetch_user_by_username(username)
                user["permission_level"] = session["permission_level"]
                del user["password"] # Avoid exposing password to frontend
    except:
        raise HTTPException(
            status_code=403, detail="An error appeared during validation"
        )
    
    return user

def validate_admin_session(request: Request, user: dict = Depends(validate_session)):
    '''
    Purpose: Checks that a user's session token corresponds to admin privileges
    '''
    if "permission_level" not in user or user["permission_level"] != "Admin":
        raise HTTPException ( 
            status_code=403, detail="Invalid permissions"
        )
    return user

@app.get("/logout")
async def logout(request: Request, response: Response):
    try:
        decoded_token = jwt.decode(request.cookies["gcode-session"], 
                                session_secret, 
                                algorithms="HS256")
        username = decoded_token["sub"]
        remove_session(username)
    except jwt.exceptions.ExpiredSignatureError:
        pass

    response.delete_cookie("gcode-session")
    return {"status":"success"}


@app.get("/api/users")
async def get_students():
    '''
    Purpose: Returns a JSON array of all student objects in the database.

    Todo:    1) Don't send student passwords back in response. This can either
                be done here or in database.py.
             2) Add error checking (return some sort of HTTP error instead of
                erroring out)
    '''
    response = fetch_all_users()
    return response


@app.get("/api/admins")
async def get_admins():
    '''
    Purpose: Returns a JSON array of all admin objects in the database.

    Todo:    1) Don't send student passwords back in response. This can either
                be done here or in database.py.
             2) Add error checking (return some sort of HTTP error instead of
                erroring out)
    '''
    response = fetch_all_admins()
    return response

@app.put("/api/appointments")
async def get_filtered_appointments(filter: list[tuple]):
    '''
    Purpose: Filters all available appointments based on the filters the student
            wants

    Input:  List of tuples which contains the category and the preference
    '''
    response = fetch_filtered_appointments(filter)
    return response

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
    


@app.put("/api/student_join")
async def put_student_join(access_token: str, student_data: UserModel):
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

@app.put("/api/put_appointment/")
async def put_appointment(appointment_data: AppointmentModel):
    '''
    Purpose: add an appointment linked to the current admin to the data base 

    Input: An appointment object 
    '''
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
async def remove_student_from_appointment(appointmentID: str, 
                                          admin_user: dict = Depends(validate_admin_session)):
    '''
    Purpose: If there are more than 24 before the appointment, update the apppointment 
            by removing the student cancel and unmark as reserved

    Input: the appointment ID to mark as unreserved 
    '''
    response = cancel_appointment(appointmentID)
    return response 

@app.put("/api/assign_student_to_class/")
async def assign_student_to_class (username : str, class_name : str, 
                                   admin_user: dict = Depends(validate_admin_session)):
    '''
    Purpose: Allows the admin to create a new student and add them to a class

    Input: the student name, and the class name to assign them to
    '''
    student = fetch_user_by_username(username)
    if student is None:
        raise HTTPException(status_code=500, 
                            detail="The given student does not exist")
    add_student_to_class(class_name, student)

@app.put("/api/unassign_student_from_class/")
async def assign_student_to_class (username : str, class_name : str, 
                                   admin_user: dict = Depends(validate_admin_session)):
    '''
    Purpose: Allows the admin to create a new student and add them to a class

    Input: the student name, and the class name to assign them to
    '''
    student = fetch_user_by_username(username)
    if student is None:
        raise HTTPException(status_code=500, 
                            detail="The given student does not exist")
    remove_student_from_class(class_name, student)

@app.put("/api/assign_instructor_to_class/")
async def assign_instructor_to_class (username : str, class_name : str, 
                                      admin_user: dict = Depends(validate_admin_session)):
    '''
    Purpose: Allows the admin to create a new student and add them to a class

    Input: the student name, and the class name to assign them to
    '''
    instructor = fetch_user_by_username(username)
    if instructor is None:
        raise HTTPException(status_code=500, 
                            detail="The given instructor does not exist")
    add_instructor_to_class(class_name, instructor)

@app.put("/api/unassign_instructor_from_class/")
async def unassign_instructor_from_class (username : str, class_name : str, 
                                          admin_user: dict = Depends(validate_admin_session)):
    '''
    Purpose: Allows the admin to create a new student and add them to a class

    Input: the student name, and the class name to assign them to
    '''
    instructor = fetch_user_by_username(username)
    if instructor is None:
        raise HTTPException(status_code=500, 
                            detail="The given instructor does not exist")
    remove_instructor_from_class(class_name, instructor)

@app.get("/api/view_students_in_class/")
async def view_students_in_class (class_name : str, 
                                  admin_user: dict = Depends(validate_admin_session)):
    # Conversion to string must be done because student documents may have an
    # 'ObjectId' field, which is non-iterable and will result in a type-error 
    # if returned directly
    return  str(get_all_students_in_class(class_name))

@app.get("/api/view_instructors_in_class/")
async def view_instructors_in_class (class_name : str, 
                                     user: dict = Depends(validate_admin_session)):
    return str(get_all_instructors_in_class(class_name))

@app.post("/api/edit_user_profile")
async def edit_user_profile (username: str, new_profile_values: dict, 
                             admin_user: dict = Depends(validate_admin_session)):
    user = fetch_user_by_username(username)

    if user["acctype"] == 'student':
        user["permission_level"] = "Student"
        editable_fields = ["firstname", "lastname", "email", "mentorid"]
    elif user["acctype"] != 'admin':
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
                                     user: dict = Depends(validate_session)):
    uneditable_fields = ["emailverified", "mentorid", "accepted_registration"]
    username = user["username"]
    for field in new_profile_values:
        if field in uneditable_fields:
            raise HTTPException(status_code=500, 
                            detail =  ("The " + field 
                                       + " cannot be edited by students"))
        update_profile_field(username, user["permission_level"], 
                             field, new_profile_values[field])

@app.post("/api/create_users/")
async def create_users (new_users: list):
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
        create_new_user(new_user["firstName"], new_user['lastName'], new_user["email"], 
                        new_user['accType'])
        if new_user['accType'] == 'Student':
            create_student_invite(access_code, new_user["email"], today)
        elif new_user['accType'] == "Tutor":
            create_user_invite(access_code, new_user["email"], today)

def sent_invite_email(to_contact: UserModel):
    student_id = fetch_user_by_username(to_contact.username)['_id']
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

@app.get("/api/questions")
async def get_questions():
    response = fetch_all_posts()
    return response