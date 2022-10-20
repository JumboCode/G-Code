from pydantic import BaseModel
from typing import List
import bson

class Student(BaseModel):    
    id: str(bson.ObjectId())
    firstname: str
    lastname: str
    classes: List