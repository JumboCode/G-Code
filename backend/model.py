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
    zoom: Optional[str] = None

class User(UserIn):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")


class Token(BaseModel):
    access_token: str
    token_type: str
class TokenData(BaseModel):
    email: Optional[str] = None
    type: Optional[str] = None

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

# class Assignment(BaseModel):
#     assignmentid: str = Field(...)
#     name: str = Field(...)
#     description: str = Field(...)
#     completed: bool = Field(...)
#     dueDate: datetime = Field(...)
#     messages: List[str] = Field(...)
#     submissionLink: str = Field(...)
#     submitted: bool = Field(...)
#     studentid: str = Field(...)

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
    ##numreplies: str = Field(...)
    replies: List[Reply] = Field(...)
    topics: List[str] = Field(...)

class Test (BaseModel):
    title: str = Field(...)
    question: str = Field(...)
    # author: str = Field(...)
    # date: datetime = Field(...)
    # ##numreplies: str = Field(...)
    # replies: List[Reply] = Field(...)
    # topics: List[str] = Field(...)


class LoginInfo(BaseModel):
    email: str = Field(...)
    password: str = Field(...)

class Post(BaseModel):
    title: str = Field(...)
    body: str = Field(...)
    author_id: str = Field(...)
    date: datetime = Field(...)
    topic: str = Field(...)
    replies: List[Reply] = Field(...)

class PostID(Post):
    id: str = Field(...)

