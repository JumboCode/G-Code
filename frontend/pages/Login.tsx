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
import Link from "next/link";
import Alert from '@mui/material/Alert'
import { login } from "../api/routes";
import { useRouter } from 'next/router'

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setloginError] = useState(false);
  const router = useRouter()

  return (
    <ThemeProvider theme={theme}>
      <div className={loginStyles.container}>
        <div className={loginStyles.formContainer}>
        <Box component="form" >
          <h1 className={loginStyles.signInText}> Sign In </h1>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Email Address"
            variant="outlined"
            sx={{ marginBottom: "20px" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUserName(event.target.value);
            }}
          />
          <TextField
            fullWidth
            id="outlined-helperText"
            label="Password"
            type="password"
            sx={{ marginBottom: "20px" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
          />
          <Link href="./ResetPassword"><text className={loginStyles.forgotPassword}>Forgot Password?</text></Link>
          {loginError && <Alert sx={{marginTop: '30px'}} severity="error"> Invalid username or password. </Alert> }
          <Button fullWidth variant="primary" sx={{margin: '20px 0 10px 0'}} onClick={() => {login(username, password, setloginError).then(() => router.push('/Dashboard')).catch(() => {setloginError(true)})}}>
            <h1 className={loginStyles.signInButton}>Login </h1>
          </Button>
        </Box>
        <text className={loginStyles.haveAccount}>
          New to GCode?
          <Link href="./Registration"> <text className={loginStyles.signIn}> Create an Account.</text> </Link>
        </text>
      </div>
    </div>
    </ThemeProvider >
  );
}
