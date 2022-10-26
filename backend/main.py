from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

from database import (
    fetch_all_students,
    fetch_all_admins
)

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
    return {"message" : "Hello, World!"}


@app.get("/api/students")
async def get_students():
    response = fetch_all_students()
    return response


@app.get("/api/admins")
async def get_admins():
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