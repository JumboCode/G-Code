import axios from "axios";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";
import loginStyles from "../styles/Login.module.css";
import Sidebar from "../components/sidebar";
import logo from "./public/GCodeLogo.png";
import { Button, ThemeProvider, Box, TextField } from "@mui/material";
import { theme } from "../theme.ts";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [loginError, setloginError] = useState(false);

  const postInfo = () => {
    const postData = {
      grant_type: "",
      username: username,
      password: password,
      scope: "",
      client_id: "",
      client_secret: "",
    };

    axios
      .post("http://localhost:8000/login", postData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
      })
      .then(function success(response) {
        console.log(response);
        const token = response.data.access_token;
        Cookies.set("gcode-session", token, { expires: 7 });
        router.push("/Dashboard");
      })
      .catch(function failure(error) {
        console.log(error);
        setloginError(true);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={loginStyles.container}>
        <Box component="form" sx={{ width: "30pc", alignItems: "center" }}>
          <h1 className={loginStyles.signInText}> Sign In </h1>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Email Address"
            variant="outlined"
            sx={{ margin: "10px" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUserName(event.target.value);
            }}
          />
          <TextField
            fullWidth
            id="outlined-helperText"
            label="Password"
            type="password"
            sx={{ margin: "10px" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
          />
          <text className={loginStyles.forgotPassword}>Forgot Password?</text>
          <Button variant="primary" sx={{ margin: "10px", width: "30pc" }}>
            <h1 className={loginStyles.signInButton}>Create Account</h1>
          </Button>
        </Box>
        <text className={loginStyles.haveAccount}>
          New to GCode?
          <text className={loginStyles.signIn}> Create an Account.</text>
        </text>
      </div>
    </ThemeProvider>
  );
}
