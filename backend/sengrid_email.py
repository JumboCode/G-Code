# todo: get API key

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


def send_invite_email(user_email, access_token, firstname):
    message = Mail(
    from_email='from_email@example.com',
    to_emails=user_email,
    subject='Welcome to G-Code!',
    html_content=f'<p> Hi {firstname}, </p> \
                    <p> You have been invited to join G-code. \
                    To sign up, use this access token {access_token}. </p>')
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)

send_invite_email()