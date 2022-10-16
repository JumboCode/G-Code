from fastapi import FastAPI
from dotenv import load_dotenv


# load enviornment variables
load_dotenv()


app = FastAPI()

# FastAPI code goes here.
@app.get("/")
async def read_root():
    return {"message" : "Hello, World!"}