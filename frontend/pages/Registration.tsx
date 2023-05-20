import React, { useState } from "react";
import loginStyles from "../styles/Login.module.css";
import { Button, ThemeProvider, TextField, Box } from "@mui/material";
import { theme } from "../theme";
import { useRouter } from "next/router";
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Cookies from "js-cookie";
import Link from "next/link";
import { validate_string, validate_email } from "../constants";
import { registerUser } from "../api/routes";

export default function Registration() {
  const router = useRouter()

  const [regError, setRegError] = useState(false);
  const [formData, setFormData] = useState({})
  const [accessCode, setAccessCode] = useState("")
  const [submissionError, setSubmissionError] = useState("")

  const handleChange = event => {
    setSubmissionError("")
    setFormData(formData => {
      return ({
        ...formData,
        [event.target.name]: event.target.value
      })
    })
  }

  const validate_form = () => {
    return (
      validate_string(formData['firstname']) &&
      validate_string(formData['lastname']) &&
      validate_email(formData['email']) &&
      validate_string(formData['password']) &&
      validate_string(accessCode)
    )
  }

  const submitForm = () => {
    if (!validate_form()) {
      setRegError(true)
    } else {
      postRegInfo()
    }
    return false
  }

  const postRegInfo = () => {
    registerUser(accessCode, formData, setSubmissionError)
  }

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
                    error={regError && !validate_string(formData['firstname'])}
                    helperText={regError && !validate_string(formData['firstname']) && "Please provide a first name."}
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
                    error={regError && !validate_string(formData['lastname'])}
                    helperText={regError && !validate_string(formData['lastname']) && "Please provide a last name."}
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
                    error={regError && !validate_email(formData['email'])}
                    helperText={regError && !validate_email(formData['email']) && "Please provide a valid email."}
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
                    error={regError && !validate_string(formData['password'])}
                    helperText={regError && !validate_string(formData['password']) && "Please provide a password."}
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
                    error={regError && !validate_string(accessCode)}
                    helperText={regError && !validate_string(accessCode) && "Please provide an access code."}
                  />
                </Grid>
                {submissionError &&
                  <Grid item xs={12}>
                    <Alert severity="error"> {submissionError} </Alert>
                  </Grid>
                }

                <Grid item xs={12}>
                  <Button fullWidth variant="primary" onClick={submitForm}>
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