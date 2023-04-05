import React, { useState } from "react";

// optimized mui imports
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import Grid from "@mui/material/Grid"

// components
import IsUserAuthorized from "../components/authentification";
import HeaderNav from "../components/headernav";

// constants
import { DRAWER_WIDTH } from "../constants";

// theme
import { theme } from "../theme.ts";
import { ThemeProvider } from '@mui/material/styles';

// styles
import assignentStyles from "../styles/Assignments.module.css";

export default function Assignments() {
  // authentication
  const [user, setUser] = useState(null);
  const get_user = curr_user => {
    if (user == null) {
      setUser(curr_user)
    }
  }
  /* Authorize user and return user 
   * information (ex. first name, username, ect.) */
  IsUserAuthorized("Student", get_user)

  if (!user) {
    return <p>Loading...</p>
  }
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <HeaderNav currentPageTitle="Assignments" />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          }}
        >
          <Grid sx={{ paddingTop: '60px' }} container>
            <Grid item xs={12}>
              <div className={assignentStyles.header1}>
                <p> ASSIGNMENTS </p>
              </div>
            </Grid>
            <Grid item xs={12} md={9}>
              <div className={assignentStyles.leftColumn}>
                <div className={assignentStyles.leftCard}>
                  Assignment 1
                </div>
                <div className={assignentStyles.leftCard}>Assignment 2</div>
                <div className={assignentStyles.leftCard}>Assignment 3</div>
              </div>
            </Grid>
            <Grid item xs={12} md={3}>
              <div className={assignentStyles.header2}> Questions? </div>
              <div className={assignentStyles.question}>
                Schedule an Appointment
              </div>
              <div className={assignentStyles.question}>Q and A Board</div>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}