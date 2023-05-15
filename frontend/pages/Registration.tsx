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
import { theme } from "../theme";
import { useRouter } from "next/router";
import Grid from '@mui/material/Grid'
import Cookies from "js-cookie";
import Link from "next/link";

// TODO:
// 1. The background gradient
// 2. Backend functionality.
//    firstName, lastName, email, password, and code have all been set

export default function Registration() {
  const router = useRouter();
  const [regError, setRegError] = useState(false);

  const [formData, setFormData] = useState({})
  const [accessCode, setAccessCode] = useState("")

  const handleChange = event => {
    setFormData(formData => {
      return ({
        ...formData,
        [event.target.name]: event.target.value
      })
    })
  }

  /* POST DATA */
  const postRegInfo = () => {
    const apiUrl = `http://localhost:8000/api/join?access_code=${accessCode}`;

    const headers = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    };

    axios.post(apiUrl, formData, { headers })
      .then(response => {
        console.log('Response:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  /* END POST DATA */


  return (
    <ThemeProvider theme={theme}>
      <div className={loginStyles.container}>
        <div className={loginStyles.formContainer}>
          <Box component="form">
            <h1 className={loginStyles.signInText}> Create an Account </h1>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="firstname"
                  id="outlined-basic"
                  label="First name"
                  variant="outlined"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="lastname"
                  id="outlined-basic"
                  label="Last name"
                  variant="outlined"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  id="outlined-helperText"
                  label="Password"
                  type="password"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="access_code"
                  id="outlined-basic"
                  label="Access Code"
                  variant="outlined"
                  onChange={event => setAccessCode(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="primary" onClick={postRegInfo}>
                  <h1 className={loginStyles.signInButton}>Create Account</h1>
                </Button>
                <text className={loginStyles.haveAccount}>
                  Already have an account?
                  <Link href="./Login"> <text className={loginStyles.signIn}> Sign in.</text> </Link>
                </text>
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
}