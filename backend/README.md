# Backend

This is the backend for the G-Code project

## Setup

### Installing dependencies

The easiest way to install dependencies for this project is by using a virtual environment. To set this up, while in the backend folder, run
```
mkdir venv
python3 -m venv ./venv
. ./venv/bin/activate
```
You should now see a `(venv)` in your terminal. To install dependencies, run
```
pip install -r requirements.txt
```

### Adding .env file
Download the `.env` file from the slack channel and place it in the `backend` folder

### Run the project

To run the project run
```
uvicorn main:app --reload
```
The api should now be accessable at http://localhost:8000 and documentation at http://localhost:8000/docs.