from datetime import datetime
from typing import List
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId
from bson.objectid import ObjectId as BsonObjectId
from pyobjectid import PyObjectId

class TimeSlot(BaseModel):
    starttime: datetime = Field(...)
    endtime: datetime = Field(...)


class Language(BaseModel):
    language: str = Field(...)
    level: str = Field(...)


class Admin(BaseModel):  
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    firstname: str = Field(...)
    lastname: str = Field(...)
    email: EmailStr = Field(...)
    phone: str = Field(...)
    classes: List[str] = Field(...)
    mentees: List[str] = Field(...)
    bio: str = Field(...)
    pronouns: str = Field(...)
    nickname: str = Field(...)
    github: str = Field(...)
    linkedin: str = Field(...)
    tutortopics: List[str] = Field(...)
    availability: List[TimeSlot] = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Student(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    firstname: str = Field(...)
    lastname: str = Field(...)
    bio: str = Field(...)
    birthdate: datetime = Field(...)
    email: EmailStr = Field(...)
    github: str = Field(...)
    languages: List[Language] = Field(...)
    linkedin: str = Field(...)
    nickname: str = Field(...)
    phone: str = Field(...)
    password: str = Field(...)
    username: str = Field(...)
    emailverified: bool = Field(...)
    pronouns: str = Field(...)
    mentorid: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class StudentInvite(BaseModel):
    email: EmailStr = Field(...)
    requestdate: datetime = Field(...)
    accesscode: str = Field(...)


class Class(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(...)

class Appointment(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    reserved: bool = Field(...)
    tutorName: str = Field(...)
    topics: List[str] = Field(...)
    startTime: datetime = Field(...)
    endTime: datetime = Field(...)
    date: datetime = Field(...)
    dayOfWeek: str = Field(...)
    studentName: str = Field(...)

class Assignment(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    assignmentid: str = Field(...)
    name: str = Field(...)
    description: str = Field(...)
    completed: bool = Field(...)
    dueDate: datetime = Field(...)
    messages: List[tuple] = Field(...)
    submissionLink: str = Field(...)
    submitted: bool = Field(...)
    studentid: str = Field(...)