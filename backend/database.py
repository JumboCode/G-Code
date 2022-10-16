from model import Student
import motor.motor_asyncio
import os

# get database uri
uri = os.environ["MONGO_DB_URI"]

# connect to database
client = motor.motor_asyncio.AsyncIOMotorClient(uri)
database = client.gcode
collection = database.students

async def fetch_one_student(title):
    document = collection.find_one({"title":title})
    return document