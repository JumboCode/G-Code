import axios from "axios";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";
import loginStyles from "../styles/Login.module.css";
import Sidebar from "../components/sidebar";
import logo from './public/GCodeLogo.png'
import { Button, ThemeProvider } from "@mui/material";
import { theme } from '../theme.ts';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Login() {
    const router = useRouter();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [loginError, setloginError] = useState(false);


    const postInfo = () => {
        axios.post(`http://127.0.0.1:8000/login`, {
            email: username,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        })
            .then(function success(response) {
                const token = response.data.Token;
                Cookies.set('gcode-session', token, { expires: 7 });
                router.push('/Dashboard');
            })
            .catch(function failure(error) {
                console.log(error);
                setloginError(true);
            })
    }

    return (
        <ThemeProvider theme={theme}>
            <div className={loginStyles.container}>
                <div className={loginStyles.formContainer}>
                    <h1 className={loginStyles.signInText}> Sign In </h1>
                    <form action="" method="get" id="signIn" className={loginStyles.form}>
                        <input type="text" name="username" placeholder="Email Address" onChange={(e) => setUserName(e.target.value)} />
                        <input type="password" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className={loginStyles.password} />
                        {loginError && <p className={loginStyles.forgotPassword}> Incorrect Username/Password <br></br>Forgot Password? </p>}
                        <Button variant="primary" onClick={postInfo}>
                            Sign In
                        </Button>
                    </form>
                </div>
            </div>
        </ThemeProvider>
    )

}
