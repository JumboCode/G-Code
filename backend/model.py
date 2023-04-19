from datetime import datetime
from typing import List
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId
from typing import Optional
from bson.objectid import ObjectId as BsonObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class TimeSlot(BaseModel):
    starttime: datetime = Field(...)
    endtime: datetime = Field(...)


class Language(BaseModel):
    language: str = Field(...)
    level: str = Field(...)

class UserIn(BaseModel):
    firstname: str = Field(...)
    lastname: str = Field(...)
    email: str = Field(...)
    password: str = Field(...)
    type: str = Field(...)

class User(UserIn):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")


class Token(BaseModel):
    access_token: str
    token_type: str
class TokenData(BaseModel):
    email: Optional[str] = None
    type: Optional[str] = None

# class Admin(BaseModel):  
#     firstname: str = Field(...)
#     lastname: str = Field(...)
#     email: EmailStr = Field(...)
#     phone: str = Field(...)
#     classes: List[str] = Field(...)
#     mentees: List[str] = Field(...)
#     bio: str = Field(...)
#     pronouns: str = Field(...)
#     nickname: str = Field(...)
#     github: str = Field(...)
#     linkedin: str = Field(...)
#     tutortopics: List[str] = Field(...)
#     availability: List[TimeSlot] = Field(...)
#     maxSlots : int = Field(...)

#     class Config:
#         allow_population_by_field_name = True
#         arbitrary_types_allowed = True
#         json_encoders = {ObjectId: str}


# class Student(BaseModel):
#     firstname: str = Field(...)
#     lastname: str = Field(...)
#     email: EmailStr = Field(...)
    
    # birthdate: datetime = Field(...)
    # github: str = Field(...)
    # linkedin: str = Field(...)
    # nickname: str = Field(...)
    # phone: str = Field(...)
    # password: str = Field(...)
    # username: str = Field(...)
    # languages: List[Language] = Field(...)
    # pronouns: str = Field(...)
    # mentorid: str = Field(...)
    # is_tutor: bool = Field(...)
    # accepted_registration: bool = Field(False)
    # bio: str = Field(...)

    # class Config:
    #     allow_population_by_field_name = True
    #     arbitrary_types_allowed = True
    #     json_encoders = {ObjectId: str}

class UserInviteRequest(BaseModel):
    firstname: str = Field(...)
    lastname: str = Field(...)
    acctype: str = Field(...)
    email: EmailStr = Field(...)

class UserInvite(BaseModel):
    firstname: str = Field(...)
    lastname: str = Field(...)
    acctype: str = Field(...)
    email: EmailStr = Field(...)
    date: datetime = Field(...)
    accesscode: str = Field(...)

class Class(BaseModel):
    name: str = Field(...)

class Appointment(BaseModel):
    reserved: bool = Field(...)
    tutorName: str = Field(...)
    topics: List[str] = Field(...)
    startTime: datetime = Field(...)
    endTime: datetime = Field(...)
    date: datetime = Field(...)
    dayOfWeek: str = Field(...)
    studentName: str = Field(...)
    tutorId: str = Field(...)

class Assignment(BaseModel):
    assignmentid: str = Field(...)
    name: str = Field(...)
    description: str = Field(...)
    completed: bool = Field(...)
    dueDate: datetime = Field(...)
    messages: List[tuple] = Field(...)
    submissionLink: str = Field(...)
    submitted: bool = Field(...)
    studentid: str = Field(...)

class Question(BaseModel):
    title: str = Field(...)
    question: str = Field(...)
    author: str = Field(...)
    date: datetime = Field(...)
    numreplies: str = Field(...)
    topics: List[str] = Field(...)


class LoginInfo(BaseModel):
    email: str = Field(...)
    password: str = Field(...)

class Reply(BaseModel):
    author_id: str = Field(...)
    body: str = Field(...)
    date: datetime = Field(...)

class Post(BaseModel):
    title: str = Field(...)
    body: str = Field(...)
    author_id: str = Field(...)
    date: datetime = Field(...)
    topic: str = Field(...)
    replies: List[Reply] = Field(...)

class PostID(Post):
    id: str = Field(...)

