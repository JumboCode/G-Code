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

def create_new_user(user: UserInModel):
    hashed_password = Hash.bcrypt(user.password)
    user_object = dict(user)
    user_object["password"] = hashed_password
    users.insert_one(user_object)

def team_accounts():
    firstnames = ["Theseus", "Jimmy", "Emma", "Elizabeth", "Sean", "Aidan", "Kimaya", "Jyoti", "Ruby", "Sarah", "Megan"]
    lastnames = ["L", "M", "P", "F", "R", "B", "W", "B", "M", "G", "Y"]
    for i in range(11):
        this_user = {
            "firstname": firstnames[i],
            "lastname": lastnames[i],
            "email": firstnames[i],
            "password":firstnames[i]
        }

        create_new_user(UserInModel(**this_user))

team_accounts()
