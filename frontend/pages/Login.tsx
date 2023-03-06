import axios from "axios";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";
import loginStyles from "../styles/Login.module.css";
import logo from "./public/GCodeLogo.png";
import { theme } from "../theme.ts";
import { ThemeProvider, TextField, Button, FormControl } from "@mui/material";

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
        <div className={loginStyles.box}>
          <div className={loginStyles.formContainer}>
            <h1 className={loginStyles.signInText}> Sign In </h1>
            <FormControl fullWidth>
              <form
                action=""
                method="get"
                id="signIn"
                className={loginStyles.form}
              >
                <TextField
                  // sx={(margin: "10pc")}
                  id="outlined-basic"
                  label="Email Address"
                  variant="outlined"
                  onChange={(e) => setUserName(e.target.value)}
                />
                <TextField
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  onChange={(e) => setUserName(e.target.value)}
                />
                <p className={loginStyles.forgotPassword}> Forgot Password? </p>
                <Button
                  variant="primary"
                  className={loginStyles.loginButton}
                  onClick={() => console.log(username, password)}
                >
                  Sign In
                </Button>
              </form>
            </FormControl>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
