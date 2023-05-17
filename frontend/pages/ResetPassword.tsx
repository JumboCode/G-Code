import axios from "axios";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";
import loginStyles from "../styles/Login.module.css";
import Sidebar from "../components/sidebar";
import logo from './public/GCodeLogo.png'
import { Button, ThemeProvider, Box, TextField } from "@mui/material";
import { theme } from '../theme';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from "next/link";
import Alert from '@mui/material/Alert'

export default function Login() {
  const router = useRouter();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [code, setCode] = useState("")
  const [loginError, setloginError] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [resetError, setResetError] = useState(false);

  const requestEmail = () => {
    axios.post(`http://localhost:8000/sendreset?email=${username}`)
      .then(() => {
        setCodeSent(true);
      })
      .catch(function failure(error) {
        console.log(error);
        setloginError(true);
      })
  }

  const resetPW = () => {
    if (password != password2 || password == "") {
      setloginError(true);
    } else {
      const data = {
        email: username,
        code: code,
        password: password,
      };
  
      axios.post('http://localhost:8000/resetpassword', data, {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      })
        .then(function success(response) {
          router.push('./Login')
        })
        .catch(function failure(error) {
          console.log(error);
          setResetError(true);
        })
    }
  }

  function form1() {
    return (
    <>
    <TextField
    fullWidth
    id="outlined-basic"
    label="Email Address"
    variant="outlined"
    sx={{ marginBottom: "20px" }}
    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      setUserName(event.target.value);
    }}/>
    {loginError && <Alert sx={{marginTop: '30px'}} severity="error"> Invalid email. </Alert> }
  <Button fullWidth variant="primary" sx={{margin: '20px 0 10px 0'}} onClick={requestEmail}>
    <h1 className={loginStyles.signInButton}>Send Link</h1>
  </Button>
  </>
  )}

  function form2() {
    return (
    <>

  <TextField
    fullWidth
    id="outlined-basic"
    label="Code"
    variant="outlined"
    sx={{ marginBottom: "20px" }}
    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      setCode(event.target.value);
  }}/>
    
  <TextField
    fullWidth
    id="outlined-basic"
    label="Password"
    variant="outlined"
    type="password"
    sx={{ marginBottom: "20px" }}
    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
  }}/>

  <TextField
    fullWidth
    id="outlined-basic"
    label="Confirm Password"
    variant="outlined"
    type="password"
    sx={{ marginBottom: "20px" }}
    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword2(event.target.value);
  }}/>
    
    {loginError && <Alert sx={{marginTop: '30px'}} severity="error"> Passwords do not match. </Alert> }

    <Button fullWidth variant="primary" sx={{margin: '20px 0 10px 0'}} onClick={resetPW}>
      <h1 className={loginStyles.signInButton}>Reset</h1>
    </Button>

    </>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={loginStyles.container}>
        <div className={loginStyles.formContainer}>
        <Box component="form" >
          <h1 className={loginStyles.signInText}> Reset Password </h1>

        {!codeSent && form1()}

        {codeSent && !resetError && form2()}

        {resetError && 
         <Alert sx={{marginTop: '30px'}} severity="error"> Error Resetting Password </Alert>
        }

        </Box>
      </div>
    </div>
    </ThemeProvider >
  );
}
