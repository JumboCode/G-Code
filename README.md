# Setup

## Frontend

1. Install npm
2. "npm install" in frontend directory
3. "npm install next" in frontend directory
To run, "npm run dev"
Open <http://localhost:3000>

## Backend

### Virtual Environment

In the backend directory:
    1. mkdir env
    2. python3 -m venv env
    3. To run on Mac: ". ./env/bin/activate"
       To run on Windows: "env/Scripts/activate"
       You should now see a `(venv)` in your terminal
    4. pip install -r requirements.txt
    5. Download the `.env` file from the slack channel and place it in the `backend` folder

To run, uvicorn main:app --reload
Open <http://localhost:8000>
Documentation at <http://localhost:8000/docs>

## Credits

Project Manager: Theseus Lim
Technical Lead: Jimmy Maslen
Designer: Ariya Zheng
Developers: Aidan Banerjee, Jyoti Bhardwaj, Elizabeth Foster, Sarah Grand, Ruby Mora, Emma Paterson, Sean Reilly, Kimaya Wijeratna, Megan Yi
