from fastapi import FastAPI

app = FastAPI()

# FastAPI code goes here.
@app.get("/")
async def read_root():
    return {"message" : "Hello, World!"}