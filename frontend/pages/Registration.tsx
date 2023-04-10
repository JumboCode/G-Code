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

export default function Registration() {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

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
          />
          <TextField
            id="outlined-basic"
            label="Last name"
            variant="outlined"
            sx={{ margin: "10px", width: "13.75pc" }}
          />
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            sx={{ margin: "10px", width: "28.8pc" }}
          />
          <TextField
            id="outlined-helperText"
            label="Password"
            type="password"
            sx={{ margin: "10px", width: "28.8pc" }}
          />
          <TextField
            id="outlined-basic"
            label="Class Code"
            variant="outlined"
            sx={{ margin: "10px", width: "28.8pc" }}
          />
          <Button variant="primary" sx={{ margin: "10px", width: "28.8pc" }}>
            <h1 className={loginStyles.signInButton}>Create Account</h1>
          </Button>
        </Box>
        <text className={loginStyles.haveAccount}>
          Already have an account?
          <text className={loginStyles.signIn}> Sign in.</text>
        </text>
      </div>
    </ThemeProvider>
  );
}
