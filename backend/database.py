'''
database.py
Purpose: Connects to the database and provides all functionality for accessing
         data from the database.
'''

from pymongo import MongoClient
from dotenv import load_dotenv
from model import Student, Admin, Appointment
import os

# load enviornment variables
load_dotenv()

# Connect to database
uri = os.environ["MONGO_DB_URI"]
client = MongoClient(uri, 8000)
database = client.db
students = database.students
admins = database.admins
appointments = database.appointments #change based on the actual collection


def fetch_all_students():
    '''
    Purpose: Fetches all students from the students collection and returns
             them as a list of Student objects
    
    Todo:    1) Don't send student passwords back in response. This can either
                be done here or in main.py.
    '''
    student_list = []
    cursor = students.find({})
    for document in cursor:
        student_list.append(Student(**document))
    return student_list


def fetch_all_admins():
    '''
    Purpose: Fetches all admins from the admins collection and returns
             them as a list of Admin objects
    
    Todo:    1) Don't send student passwords back in response. This can either
                be done here or in main.py.
    '''
    admin_list = []
    cursor = admins.find({})
    for document in cursor:
        admin_list.append(Admin(**document))
    return admin_list 


def fetch_filtered_appointments(filters):
    filter_dict = {"reserved" : False}

    for fil in filters:
        filter_dict.update({fil[0]:fil[1]})
    
    appt_list = []
    cursor = appointments.find(filter_dict)
    for document in cursor:
        appt_list.append(Appointment(**document))
    return appt_list
 