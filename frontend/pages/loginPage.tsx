import axios from "axios";

import Cookies from 'js-cookie';
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";
import Sidebar from "../components/sidebar";


export default function loginPage() {
    const [getusername, setUserName] = useState();
    const [getpassword, setPassword] = useState();
    const [loginError, setloginError] = useState(false);

    const postInfo = () => {
        axios.post('http://localhost:8000/login', {
    email: 'password_test:test',
    password: 'test'
}, {
    headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
})
.then(response => {
    const token = response.data.Token;
    console.log(token)
    Cookies.set('gcode-session', token, { expires: 7 }); // Expires in 7 days
})
.catch(error => {
    console.error(error);
});

    }

    return (
        <div>
            <Sidebar currentPageTitle={"HOME"} />
            <h1>Please Log In</h1>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                {loginError && <h2>Username or Password Incorrect</h2>}
                <div>
                    <button onClick={postInfo}>Submit</button>
                </div>
        </div>
    )
}

