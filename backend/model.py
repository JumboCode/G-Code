from pydantic import BaseModel

class Student(BaseModel):
    name: str
    year: str
    majors: list