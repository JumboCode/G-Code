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

export default function Welcome() {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [code, setCode] = useState();

  return (
    <ThemeProvider theme={theme}>
      <div className={loginStyles.container}> Hello</div>
    </ThemeProvider>
  );
}