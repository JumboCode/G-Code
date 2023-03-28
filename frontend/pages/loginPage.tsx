import axios from "axios";
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
        axios.post('http://127.0.0.1:8000/login', {
            username: getusername,
            password: getpassword
        })
            .then(function success(response) {
                console.log(response);
            })
            .catch(function failure(error) {
                setloginError(true);
            })
    }

    return (
        <div>
            <Sidebar currentPageTitle={"HOME"} />
            <h1>Please Log In</h1>
            <form>
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
            </form>
        </div>
    )
}

