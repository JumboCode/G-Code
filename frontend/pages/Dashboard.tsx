import React from "react";
import { Grid, Box, CssBaseline} from "@mui/material";
import HeaderNav from '../components/headernav.tsx';

import dashboardStyles from "../styles/Dashboard.module.css";
import TutoringCardDisplay from "../components/tutoringCard";

const drawerWidth = 240;

export default function Dashboard() {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <HeaderNav />

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Grid container spacing={2}>
            <Grid className={dashboardStyles.header1} item xs={12}>
              <p> Welcome, Ariya </p>
            </Grid>
            <Grid item sm={12} md={7}>
              <div className={dashboardStyles.header2}>Coming Up Soon</div>
              <div className={dashboardStyles.leftCard}>
                <div className={dashboardStyles.cardTitle}>
                  <TutoringCardDisplay sessions={2} />
                </div>
              </div>
              <div className={dashboardStyles.leftCard}>
                <div className={dashboardStyles.cardTitle}>Assignments</div>
              </div>
              <div className={dashboardStyles.leftCard}>
                <div className={dashboardStyles.cardTitle}>Work Together</div>
              </div>
              <div className={dashboardStyles.leftCard}>
                <div className={dashboardStyles.cardTitle}>Events</div>
              </div>
            </Grid>
            <Grid item sm={12} md={5}>
              <div className={dashboardStyles.header2}> Ask Somebody </div>

              <div className={dashboardStyles.question}>Programming Help</div>
              <div className={dashboardStyles.question}>Career Development</div>

              <div className={dashboardStyles.header2}>Anonymous FAQs</div>
              <div className={dashboardStyles.rightCard}>
                Trending Questions Board
                <div className={dashboardStyles.arrowIcon}>{">"}</div>
              </div>

              <div className={dashboardStyles.header2}>Community Resources</div>
              <div className={dashboardStyles.rightCard}>
                Commonly Asked Questions
                <div className={dashboardStyles.arrowIcon}>{">"}</div>
              </div>
              <div className={dashboardStyles.rightCard}>
                Helpful Links for HW
                <div className={dashboardStyles.arrowIcon}>{">"}</div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>

  );
}
