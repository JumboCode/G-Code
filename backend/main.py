'''
main.py
Purpose: Creates server and all routes for G-Code backend.
Authors: G-Code Jumbocode Team
'''

import random
import string

from http.client import HTTPException
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import Student


# Create app
app = FastAPI()

# Import functions from database.py
from database import (
    fetch_all_students,
    fetch_all_admins,
    fetch_one_invite,
    create_student_invite,
    create_student
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

@app.get("/")
async def read_root():
    '''
    Purpose: Demo route to test if database is running.
    '''
    return {"message" : "Hello, World!"}


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
    #need to include current date
    date = ""
    create_student_invite(accessKey, email, date)
    


@app.put("/api/student_join")
async def put_student_join(access_token: str, student_data: Student):
    '''
    Purpose: Verifies that access token that was added is valid and then
             adds the student with all of their data into the database.

    Input:   An access token, which is a string. Also the student's data,
             as specified by the model.
    '''
    studentFromKey = await fetch_one_invite(access_token)
    if studentFromKey:
        await create_student(student_data)
    raise HTTPException(404, f"there are no students with this key")