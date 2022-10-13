# Backend

This is the backend for the G-Code project

## Setup

1. Installing dependencies

The easiest way to install dependencies for this project is by using a virtual environment. To set this up, while in the backend folder, run
```
mkdir venv
python3 -m venv ./venv
. ./venv/bin/activate
```
You should now see a `(venv)` in your terminal. To install dependencies, run
```
pip install -r requirements
```
2. Create `.env` file

Create a `.env` file to store passwords, private keys, etc. (todo)

3. Run the project

To run the project run
```
uvicorn main:app --reload
```
The api should now be accessable at http://localhost:8000 and documentation at http://localhost:8000/docs.