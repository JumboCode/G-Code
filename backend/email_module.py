from smtplib import SMTP_SSL, SMTP
import os
from email.message import EmailMessage
from datetime import datetime, timezone, timedelta, date
import datetime
import time
from model import UserInvite

def send_email(msg: str, subject: str, recipient: str):
    username = "jumbo.g.code@gmail.com"
    password = os.environ["EMAIL_PASSWORD"]

    emsg = EmailMessage()
    emsg['Subject'] = subject
    emsg['From'] = username
    emsg['To'] = recipient
    emsg.set_content(msg)

    server = SMTP("smtp.gmail.com:587")
    server.starttls()
    server.login(username, password)
    #server.sendmail(username, recipient, msg, mail_options=("8bitmime"))
    server.send_message(emsg)
    server.quit()

def format_appt_reminder(firstname: str, date_obj: datetime):
    day_str = date_obj.strftime("%A %B %d")
    time_str = date_obj.strftime("%I:%M %p")
    message = "Hi " + firstname + ",\n\n" + "This is reminder that you have an office hours appointment on " + day_str + " at " + time_str +  ".\n\n" + "Best,\n{G}Code"
    return message

def format_invite(invite: UserInvite):
    message = f"Hello,\n\n You have been invited to join G-Code. Your access code is {invite.accesscode}."
    return message