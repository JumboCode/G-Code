'''
main.py
Purpose: Creates server and all routes for G-Code backend.
Authors: G-Code Jumbocode Team
'''

import random
import string
from datetime import datetime

from http.client import HTTPException
from fastapi import FastAPI
import os
from fastapi import FastAPI, Response, Request, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from model import Student
from model import Appointment
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import jwt
import bcrypt
from database import *
from datetime import datetime

# Create app
app = FastAPI()
load_dotenv()

# Used for encrypting session tokens
session_secret = os.environ["SECRET_SESSION_KEY"]

# Import functions from database.py
from database import (
    fetch_all_students,
    fetch_all_admins,
    fetch_filtered_appointments
)

# Import functions from database.py
from database import (
    fetch_all_students,
    fetch_all_admins,
    fetch_one_invite,
    create_student_invite,
    create_student,
    remove_student_invite
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

def validate_session(request: Request):
    '''
    Purpose: Checks that a user's session token is valid
    '''
    decoded_token = jwt.decode(request.cookies["gcode-session"], 
                               session_secret, 
                               algorithms="HS256")
    username = decoded_token["sub"]
    session = fetch_session_by_username(username)
    if session == None:
        raise HTTPException ( 
            status_code=403, detail="Invalid session, please log-in"
        )
    return session["permission_level"]

def validate_admin_session(request: Request, permission_level: str = Depends(validate_session)):
    '''
    Purpose: Checks that a user's session token corresponds to admin privileges
    '''
    if permission_level != "Admin":
        raise HTTPException ( 
            status_code=403, detail="Invalid permissions"
        )

@app.get("/")
async def read_root():
    '''
    Purpose: Demo route to test if database is running.
    '''
    return {"message" : "Hello, World!"}

@app.post("/login")
def login(response: Response, username: str = Form(...), password: str = Form(...)):    
    student = fetch_student_by_username(username)
    admin = fetch_admin_by_username(username)    
    
    if student != None:
        user = student
        user_type = "Student"
    elif admin != None:
        user = admin
        user_type = "Admin"
    else:
        raise HTTPException(
            status_code=403, detail="Invalid Username"
        )
    
    stored_password = user["password"]
    stored_password = stored_password.encode('utf-8')
    encoded_password = password.encode('utf-8')
    if not bcrypt.checkpw(encoded_password, stored_password):
        raise HTTPException(
            status_code=403, detail="Invalid Password"
        )

    # If the user trying to log-in already has an active session, it's removed
    # so that duplicate session data will not be created
    if fetch_session_by_username(username) != None:
        remove_session(username)
        response.delete_cookie("gcode-session")

    # Passing timezone.utc to the datetime.now() call that's used in add_session
    # is necessary for the time-to-live index in the MongoDB database to work,
    # which automatically removes sessions from the database after 4 hours
    add_session(username, user_type, datetime.now(timezone.utc))

    payload = {
                'sub': username,
                'exp': datetime.now(timezone.utc) + timedelta(hours=4),
                'iat': datetime.now(timezone.utc),
            }
    token = jwt.encode(payload, session_secret, algorithm='HS256')
    response.set_cookie("gcode-session", token)
    return {"ok": True}

@app.get("/logout")
async def logout(request: Request, response: Response):
    decoded_token = jwt.decode(request.cookies["gcode-session"], 
                               session_secret, 
                               algorithms="HS256")
    username = decoded_token["sub"]
    remove_session(username)
    response.delete_cookie("gcode-session")
    return {"status":"success"}


@app.get("/api/students")
async def get_students():
    '''
    Purpose: Returns a JSON array of all student objects in the database.

    Todo:    1) Don't send student passwords back in response. This can either
                be done here or in database.py.
             2) Add error checking (return some sort of HTTP error instead of
                erroring out)
    '''
    response = fetch_all_students()
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
async def put_student_join(access_token: str, student_data: Student):
    '''
    Purpose: Verifies that access token that was added is valid and then
             adds the student with all of their data into the database.

    Input:   An access token, which is a string. Also the student's data,
             as specified by the model.
    '''
    studentFromKey = fetch_one_invite(access_token)
    if studentFromKey:
        await create_student(student_data)
    raise HTTPException(404, f"there are no students with this key")
        s = create_student(student_data.dict())
        remove_student_invite(access_token)
        return s
    else:
        return HTTPException("Student was not created")

@app.put("/api/put_appointment/")
async def put_appointment(appointment_data: Appointment):
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
async def remove_student_from_appointment(appointmentID: str):
    '''
    Purpose: If there are more than 24 before the appointment, update the apppointment 
            by removing the student cancel and unmark as reserved

    Input: the appointment ID to mark as unreserved 
    '''
    response = cancel_appointment(appointmentID)
    return response 
