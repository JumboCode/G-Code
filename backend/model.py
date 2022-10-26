from datetime import datetime
from optparse import Option
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId
from pyobjectid import PydanticObjectId


class TimeSlot(BaseModel):
    starttime: datetime = Field(...)
    endtime: datetime = Field(...)


class Language(BaseModel):
    language: str = Field(...)
    level: str = Field(...)


class Admin(BaseModel):  
    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="_id")
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
    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="_id")
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
    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="_id")
    email: EmailStr = Field(...)
    requestdate: datetime = Field(...)
    accesscode: str = Field(...)


class Class(BaseModel):
    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="_id")
    name: str = Field(...)
