'''
main.py
Purpose: Creates server and all routes for G-Code backend.
Authors: G-Code Jumbocode Team
'''

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create app
app = FastAPI()

# Import functions from database.py
from database import (
    fetch_all_students,
    fetch_all_admins
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
    '''
    response = fetch_all_students()
    return response


@app.get("/api/admins")
async def get_admins():
    '''
    Purpose: Returns a JSON array of all admin objects in the database.

    Todo:    1) Don't send student passwords back in response. This can either
                be done here or in database.py.
    '''
    response = fetch_all_admins()
    return response


# @app.get("/getall")
# async def fetch_all_students():
#     result: model.Student = database.collection.find({})
#     return result

# @app.get("/{firstname}")
# async def fetch_one_student(firstname):
#     result = database.collection.find_one({"firstname":firstname})
#     return result