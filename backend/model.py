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


# Authentication
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    type: Optional[str] = None

# User invites
class UserInviteRequest(BaseModel):
    acctype: str = Field(...)
    email: EmailStr = Field(...)

class UserInvite(UserInviteRequest):
    date: datetime = Field(...)
    accesscode: str = Field(...)

# Assignments
class IndividualAssignment(BaseModel):
    submitted: bool = Field(...)
    submissionLink: Optional[str] = Field(...)
    studentid: Optional[str] = Field(...)
    messages: List[str] = Field(...)

class AssignmentIn(BaseModel):
    name: str = Field(...)
    description: str = Field(...)
    dueDate: datetime = Field(...)
    individual_assignments: Optional[List[IndividualAssignment]] = []

class Assignment(AssignmentIn):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

class StudentAssignmentView(AssignmentIn):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    individual_assignment: IndividualAssignment


# Appointments
class AppointmentBookingIn(BaseModel):
    tutorEmail: str = Field(...)
    startTime: datetime = Field(...)
    endTime: datetime = Field(...)

class AppointmentBooking(AppointmentBookingIn):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    studentEmail: str = Field(...)

class Appointment(AppointmentBooking):
    id2: str = Field(...)

###################################################################
############################## Users ##############################
###################################################################

class AppointmentSlot(BaseModel):
    starttime: float = Field(...)
    endtime: float = Field(...)

class AppointmentSchedule(BaseModel):
    monday: list[AppointmentSlot] = []
    tuesday: list[AppointmentSlot] = []
    wednesday: list[AppointmentSlot] = []
    thursday: list[AppointmentSlot] = []
    friday: list[AppointmentSlot] = []
    saturday: list[AppointmentSlot] = []
    sunday: list[AppointmentSlot] = []

class UserIn(BaseModel):
    firstname: str = Field(...)
    lastname: str = Field(...)
    email: str = Field(...)
    password: str = Field(...)
    zoom: Optional[str] = None
    timezone: Optional[str] = None
    maxsessions: Optional[int] = None
    linkedin: Optional[str] = None
    pronouns: Optional[str] = None
    bio: Optional[str] = None
    github: Optional[str] = None

class UserUpdate(BaseModel):
    firstname: str = Field(...)
    lastname: str = Field(...)
    email: str = Field(...)
    zoom: str = Field(...)

class User(UserIn):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    type: str = Field(...)
    appointment_schedule: Optional[AppointmentSchedule] = AppointmentSchedule()

###################################################################
############################## Posts ##############################
###################################################################

class ReplyIn(BaseModel):
    body: str = Field(...)

class Reply(ReplyIn):
    author_id: str = Field(...)
    date: datetime = Field(...)

class PostIn(BaseModel):
    title: str = Field(...)
    body: str = Field(...)

class ResetDataIn(BaseModel):
    email: str = Field(...)
    code: str = Field(...)
    password: str = Field(...)

class ResetData(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: str = Field(...)
    code: str = Field(...)

class Post(PostIn):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    author_id: str = Field(...)
    title: str = Field(...)
    body: str = Field(...)
    date: datetime = Field(...)
    replies: List[Reply] = Field(...)