from datetime import datetime
from typing import List
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId
from typing import Optional
from bson.objectid import ObjectId as BsonObjectId

# For MongoDB IDs
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

# User models
class AppointmentSlot(BaseModel):
    weekday: str = Field(...)
    start_time: float = Field(...)
    end_time: float = Field(...)

class UserIn(BaseModel):
    firstname: str = Field(...)
    lastname: str = Field(...)
    email: str = Field(...)
    password: str = Field(...)
    type: str = Field(...)
    zoom: Optional[str] = None
    appointment_slots: Optional[List[AppointmentSlot]] = None

class User(UserIn):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

# Authentication
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    type: Optional[str] = None

# User invites
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

# Assignments
class IndividualAssignment(BaseModel):
    submitted: bool = Field(...)
    submissionLink: str = Field(...)
    student_email: EmailStr = Field(...)
    messages: List[str] = Field(...)

class Assignment(BaseModel):
    assignmentid: str = Field(...)
    name: str = Field(...)
    description: str = Field(...)
    dueDate: datetime = Field(...)
    individualAssignments: List[IndividualAssignment] = None

# Posts (TODO: remove unneeded models)
class Reply(BaseModel):
    author_id: str = Field(...)
    body: str = Field(...)
    date: datetime = Field(...)

class QuestionReply(BaseModel):
    reply: Reply = Field(...)
    question_name: str = Field(...)

class Question(BaseModel):
    title: str = Field(...)
    question: str = Field(...)
    author: str = Field(...)
    date: datetime = Field(...)
    replies: List[Reply] = Field(...)
    topics: List[str] = Field(...)

class Post(BaseModel):
    title: str = Field(...)
    body: str = Field(...)
    author_id: str = Field(...)
    date: datetime = Field(...)
    topic: str = Field(...)
    replies: List[Reply] = Field(...)

class PostID(Post):
    id: str = Field(...)

# Appointments
class AppointmentBookingIn(BaseModel):
    tutorEmail: str = Field(...)
    startTime: datetime = Field(...)
    endTime: datetime = Field(...)

class AppointmentBooking(AppointmentBookingIn):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    studentEmail: str = Field(...)
