import React, { useState } from "react";

// optimized mui imports
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import Grid from "@mui/material/Grid"
import { ThemeProvider } from '@mui/material/styles';

// components
import IsUserAuthorized from "../authentification";
import HeaderNav from "../headernav";

// constants
import { DRAWER_WIDTH } from "../../constants";

// theme
import { theme } from "../../theme.ts";

// styles
import assignentStyles from "../../styles/Assignments.module.css";

export default function StudentAssignments(props) {
  const user = props.user

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <HeaderNav user={{firstname: user.firstname}}  currentPageTitle="Assignments" />
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