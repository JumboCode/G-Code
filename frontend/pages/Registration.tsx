import axios from "axios";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";
import loginStyles from "../styles/Login.module.css";
import Sidebar from "../components/sidebar";
import logo from "./public/GCodeLogo.png";
import { Button, ThemeProvider, TextField, Box } from "@mui/material";
import { theme } from "../theme.ts";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

// TODO:
// 1. The background gradient
// 2. Backend functionality.
//    firstName, lastName, email, password, and code have all been set

export default function Registration() {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const postInfo = () => {
    const postData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      code: code
    };
    
    fetch('http://localhost:8000/register_student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      router.push('/Login');
      // instead of logging them in, I'm just pushing them to login 
      // for now
    })
    .catch(error => {
      console.log(error);
      // make a function to call which displays a message to user
      // saying: "Email is already in use, please try another"
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={loginStyles.container}>
        <Box component="form" sx={{ width: "30pc", alignItems: "center" }}>
          <h1 className={loginStyles.signInText}> Create an Account </h1>
          <TextField
            id="outlined-basic"
            label="First name"
            variant="outlined"
            sx={{ margin: "10px", width: "13.75pc" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFirstName(event.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="Last name"
            variant="outlined"
            sx={{ margin: "10px", width: "13.75pc" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLastName(event.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            sx={{ margin: "10px", width: "28.8pc" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
          />
          <TextField
            id="outlined-helperText"
            label="Password"
            type="password"
            sx={{ margin: "10px", width: "28.8pc" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="Class Code"
            variant="outlined"
            sx={{ margin: "10px", width: "28.8pc" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCode(event.target.value);
            }}
          />
          <Button variant="primary" onClick={postInfo} sx={{ margin: "10px", width: "28.8pc" }}>
            <h1 className={loginStyles.signInButton}>Create Account</h1>
          </Button>
        </Box>
        <text className={loginStyles.haveAccount}>
          Already have an account?
          <Button className={loginStyles.signIn} onClick={() => {
            router.push('/Login')}}>Sign in.</Button>
        </text>
      </div>
    </ThemeProvider>
  );
}