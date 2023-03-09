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


// TODO
// 1. Forgot 



export default function Login() {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    // const credentials = {
    //     username: setUserName,
    //     password: setPassword
    // };

    // React.useEffect(() => {
    //     axios.put('http://localhost:8000/api/login/', credentials)
    // }, []);

    return (
        <ThemeProvider theme={theme}>
            <div className={loginStyles.container}>
                <div className={loginStyles.formContainer}>
                    <h1 className={loginStyles.signInText}> Sign In </h1>
                    <form action="" method="get" id="signIn" className={loginStyles.form}>
                        <input type="text" name="username" placeholder="Email Address" onChange={(e) => setUserName(e.target.value)} />
                        <input type="password" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className={loginStyles.password} />
                        <p className={loginStyles.forgotPassword}> Forgot Password? </p>
                        <Button variant="primary" onClick={() => console.log(username, password)}>
                            Sign In
                        </Button>
                    </form>
                </div>
            </div>
        </ThemeProvider>
    )

}
