from datetime import datetime
from typing import List
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from bson import ObjectId

# PyObjectId

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

# Sub Models

class TimeSlotModel(BaseModel):
    starttime: datetime = Field(...)
    endtime: datetime = Field(...)

# Database Models

# User invite request is a model of what the admin inputs when they request
# a new user to be added to the system
class UserInviteRequest(BaseModel):
    firstname: str = Field(...)
    lastname: str = Field(...)
    acctype: str = Field(...)
    email: EmailStr = Field(...)

# User invite extends user invite request and adds two new fields
class UserInviteModel(UserInviteRequest):
    requestdate: datetime = Field(...)
    accesscode: str = Field(...)

# User
class UserInModel(BaseModel):
    firstname: str = Field(...)
    lastname: str = Field(...)
    email: str = Field(...)
    password: str = Field(...)

class UserModel(UserInModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

# Assignment
class AssignmentModel(BaseModel):
    assignmentid: str = Field(...)
    name: str = Field(...)
    description: str = Field(...)
    completed: bool = Field(...)
    dueDate: datetime = Field(...)
    messages: List[tuple] = Field(...)
    submissionLink: str = Field(...)
    submitted: bool = Field(...)
    studentid: str = Field(...)

# Appointment
class AppointmentModel(BaseModel):
    reserved: bool = Field(...)
    tutorName: str = Field(...)
    topics: List[str] = Field(...)
    startTime: datetime = Field(...)
    endTime: datetime = Field(...)
    date: datetime = Field(...)
    dayOfWeek: str = Field(...)
    studentName: str = Field(...)
    tutorId: str = Field(...)

# Post reply
class PostReplyModel(BaseModel):
    author_id: str = Field(...)
    body: str = Field(...)

# Post
class PostModel(BaseModel):
    title: str = Field(...)
    body: str = Field(...)
    author_id: str = Field(...)
    date: datetime = Field(...)
    replies: List[PostReplyModel] = Field(...)
    topics: List[str] = Field(...)

# Class
class ClassModel(BaseModel):
    name: str = Field(...)

    #################

class Token(BaseModel):
    access_token: str
    token_type: str
class TokenData(BaseModel):
    email: Optional[str] = None