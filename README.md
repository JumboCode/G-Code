# GCODE

## Frontend Setup

1. Install npm
2. "npm install" in frontend directory
3. "npm install next" in frontend directory

To run, "npm run dev"
Open <http://localhost:3000>

## Backend Setup

1. Install python
2. cd to backend directory
3. mkdir env
4. python3 -m venv env
5. To run on Mac: ". ./env/bin/activate"
    To run on Windows: "env/Scripts/activate"
    You should now see a `(venv)` in your terminal
6. pip install -r requirements.txt
7. Download the `.env` file from the slack channel and place it in the `backend` folder

To run, uvicorn main:app --reload
Open <http://localhost:8000>
Documentation at <http://localhost:8000/docs>

## Tips for Git

When you are starting a sprint, always pull to get the most updated version
of the main branch and then create a new branch for your team. You can do so 
with the following commands:

```
git checkout main
git pull
git checkout -b [branch_name]
```

In order for your teammate(s) to access this branch, push to GitHub:

```
git push
```

Your teammate(s) may now switch to your branch using

```
git checkout [branch_name]
```

Always try to commit regulary, at least once per day that your are working
on the project, and leave helpful commit messages. You can do so with the 
following commands:

```
git add .
git commit -m "helpful message"
```

Once you are finished with your task, push your code to GitHub and then
open the repository in a browser. You should see a green button that says
'create pull request'. Click this button and then write up your pull request.

## Credits

Project Manager: Theseus Lim

Technical Lead: Jimmy Maslen

Designer: Ariya Zheng

Developers: Aidan Banerjee, Jyoti Bhardwaj, Elizabeth Foster, Sarah Grand, Ruby Mora, Emma Paterson, Sean Reilly, Kimaya Wijeratna, Megan Yi
