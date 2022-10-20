from fastapi import FastAPI
from dotenv import load_dotenv
import database
import model

# load enviornment variables
load_dotenv()

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message" : "Hello, World!"}

@app.get("/getall")
async def fetch_all_students():
    result: model.Student = database.collection.find({})
    return result

@app.get("/{firstname}")
async def fetch_one_student(firstname):
    result = database.collection.find_one({"firstname":firstname})
    return result