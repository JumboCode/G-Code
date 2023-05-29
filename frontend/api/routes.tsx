import axios from 'axios'
import Cookies from 'js-cookie'
import { dateToString } from '../constants'

export const baseurl = 'https://q4vrg73ubm7pbjmvg53jti6qea0dxovw.lambda-url.us-east-1.on.aws/'

export async function getCurrentAssignments(setCurrentAssignments) {
    const token = Cookies.get('gcode-session')
    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    }
    axios.get(`${baseurl}/api/current_assignments`, { headers })
        .then(response => setCurrentAssignments(response.data))
        .catch(error => console.log(error))
}

export async function getPreviousAssignments(setPreviousAssignments) {
    const token = Cookies.get('gcode-session')
    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    }
    axios.get(`${baseurl}/api/past_assignments`, { headers })
        .then(response => setPreviousAssignments(response.data))
        .catch(error => console.log(error))
}

export async function saveSchedule(appointmentSchedule) {
    const token = Cookies.get('gcode-session')

    const apiUrl = `${baseurl}/api/save_schedule?maxSessions=${0}&timeZone=${0}`;

    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    };

    axios.post(apiUrl, appointmentSchedule, { headers })
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

export async function getAssignment(assignment_id, setAssignment) {
    const apiUrl = `${baseurl}/api/assignment_by_id`
    const token = Cookies.get('gcode-session')
    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    axios.get(`${apiUrl}?assignment_id=${assignment_id}`, { headers })
        .then(response => {
            setAssignment(response.data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export async function getStudents(setStudents) {
    axios.get(`${baseurl}/api/students`)
        .then(response => setStudents(response.data))
}

export async function postQuestion(question) {
    const token = Cookies.get('gcode-session');
    const config = {
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    };
    axios.post(`${baseurl}/api/create_post`, question, config)
}

export async function deleteUser(user_id) {
    const token = Cookies.get('gcode-session')
    axios.delete(`${baseurl}/api/user`, {
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        params: {
            user_id: user_id
        }
    })
}

export async function getUsers(setUsers) {
    axios.get(`${baseurl}/api/users`)
        .then(response => { setUsers(response.data) })
        .catch(error => console.log(error))
}

export async function getUserMap(setUserMap) {
    axios.get(`${baseurl}/api/users`).then((res) => {
        let users_map = {}
        for (const user_idx in res.data) {
            const user = res.data[user_idx]
            users_map[user._id] = user
        }
        setUserMap(users_map)
    })
}

export async function getUserEmailMap(setUserEmailMap) {
    axios.get(`${baseurl}/api/users`).then((res) => {
        let users_map = {}
        for (const user_idx in res.data) {
            const user = res.data[user_idx]
            users_map[user.email] = user
        }
        setUserEmailMap(users_map)
    })
}

export async function getQuestion(question_id, setQuestion) {
    axios.get(`${baseurl}/api/post_by_id`, {
        params: {
            id_string: question_id
        },
    }).then(res => {
        setQuestion(res.data)
    }).catch(error => {
        console.log(error)
    })
}

export async function submitReply(question_id, reply) {
    const token = Cookies.get('gcode-session')

    const apiUrl = `${baseurl}/api/reply_to_post?post_ID=${question_id}`;

    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    };

    const data = {
        body: reply,
    };

    axios.post(apiUrl, data, { headers })
}

export async function submitAssignment(assignment_id, gitHub) {
    const apiUrl = `${baseurl}/api/submit_assignment`
    const token = Cookies.get('gcode-session')
    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
    };
    axios.get(`${apiUrl}?assignment_id=${assignment_id}&github_link=${gitHub}`, { headers })
}

export async function getAssignments(setAssignments) {
    const apiUrl = `${baseurl}/api/assignments`;

    const token = Cookies.get('gcode-session')

    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
    };

    axios.get(apiUrl, { headers })
        .then(response => {
            setAssignments(response.data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export async function setCurrentDayTutors(date: Date, setCurrentDay, setTutorProfiles) {
    setCurrentDay(date)
    const dateString = dateToString(date)
    axios.get(`${baseurl}/api/get_available_appointments?date=` + dateString).then(
        (res) => {
            let tutor_list = []
            for (let tutor_name in res.data) {
                if (res.data[tutor_name].length > 0) {
                    tutor_list.push({
                        name: tutor_name,
                        email: tutor_name,
                        date: date,
                        times: res.data[tutor_name]
                    })
                }
            }
            setTutorProfiles(tutor_list)
        }
    )
}

export async function getSessions(setSessions) {
    const token = Cookies.get('gcode-session');
    axios.get(`${baseurl}/api/appointments`, {
        headers: {
            Accept: "application/json",
            Authorization: 'Bearer ' + token
        },
    })
        .then((response) => {
            console.log(response)
            setSessions(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function handleCancel(id: string, handleBack) {

    const token = Cookies.get('gcode-session');

    axios.put(`${baseurl}/api/cancel-appointment?id=` + id, null, {
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
    handleBack();
};

export async function inviteUsers(peopleToAdd) {
    const apiUrl = `${baseurl}/api/user_invites`;
    const token = Cookies.get("gcode-session")

    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    };

    axios.post(apiUrl, peopleToAdd, { headers })
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            alert("error")
            console.error('Error:', error);
        });
}

export async function getUser(user_id, setProfile) {
    const apiUrl = `${baseurl}/api/user_by_id`;

    const headers = {
        'accept': 'application/json',
    };

    axios.get(`${apiUrl}?user_id=${user_id}`, { headers })
        .then(response => {
            setProfile(response.data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export async function login(username, password, setloginError) {
    const postData = {
        grant_type: '',
        username: username,
        password: password,
        scope: '',
        client_id: '',
        client_secret: ''
    };


    return new Promise(resolve => {
        axios.post(`${baseurl}/login`, postData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'accept': 'application/json'
            }
        })
            .then(function success(response) {
                const token = response.data.access_token;
                Cookies.set('gcode-session', token, { expires: 7 });
                resolve('resolved')
            })
            .catch(function failure(error) {
                console.log(error);
                setloginError(true);
            })
    });
}

export async function updateUser(userData) {
    const token = Cookies.get("gcode-session")

    const apiUrl = `${baseurl}/api/user_by_id`;

    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    };

    axios.put(apiUrl, userData, { headers })
}

export async function registerUser(accessCode, userData, setSubmissionError) {
    const apiUrl = `${baseurl}/api/join?access_code=${accessCode}`;
    const headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    };

    axios.post(apiUrl, userData, { headers })
        .then(response => {
            // router.push('/login')
        })
        .catch(error => {
            console.log(error)
            if (error.response) {
                setSubmissionError(error.response.data.detail)
            }
        });
}

export async function getQuestions(setQuestions) {
    axios.get(`${baseurl}/api/questions`).then((res) => {
        setQuestions(
            res.data.map(question => {
                return {
                    ...question,
                    date: new Date(Date.parse(question.date)),
                }
            })
        );
    });
}

export async function saveAssignment(assignmentName, description, assignmentDue) {
    const apiUrl = `${baseurl}/api/assignment`;
    const token = Cookies.get('gcode-session')
    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    };
    const requestData = {
        name: assignmentName,
        description: description,
        dueDate: assignmentDue,
    };
    return new Promise(resolve => {
        axios.post(apiUrl, requestData, { headers })
            .then(_ => {
                resolve('resolved')
            })
            .catch(error => {
                console.error('Error:', error);
            });
    })
}

export async function changePassword(data) {
    console.log(data)

    const apiUrl = `${baseurl}/changepassword`;
    const token = Cookies.get('gcode-session')
    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    };
    return new Promise((resolve, reject) => {
        axios.post(apiUrl, data, { headers })
            .then(_ => {
                resolve('resolved')
            })
            .catch(error => {
                reject(error)
            });
    })
}