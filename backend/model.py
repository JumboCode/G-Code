from pydantic import BaseModel

class Student(BaseModel):  
    firstname: str
    lastname: str
    courses: list