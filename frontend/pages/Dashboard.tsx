import React from "react";
import { Grid, Box, CssBaseline } from "@mui/material";
import HeaderNav from '../components/headernav.tsx';
import { DRAWER_WIDTH } from "../constants";
import dashboardStyles from "../styles/Dashboard.module.css";
import TutoringCardDisplay from "../components/tutoringCard";
import styles from '../styles/Home.module.css'
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme.ts'

import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Dashboard() {

  // make call to backend to get real data
  const assignmentList = [
    {
      name: "Paired Programming Project Pt. 2",
      dueDate: "Fri, Nov 25, 10:59 PM"
    },
    {
      name: "Week 6 Module of Codecademy",
      dueDate: "Fri, Nov 25, 10:59 PM"
    },
  ]

  // make call to backend to get real data
  const eventList = [
    {
      name: "Discussion: Career Dev with Ryan Lester",
      eventDate: "Sun, Nov 27, 1:00-2:00 PM"
    },
  ]


  return (
    <ThemeProvider theme={theme}>
      <Box className={styles.content} sx={{ display: 'flex' }}>
        <CssBaseline />
        <HeaderNav currentPageTitle="Dashboard" />

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
        >
          <Grid container spacing={2}>
            <Grid className={dashboardStyles.header1} item xs={12}>
              <p> Welcome, Ariya </p>
            </Grid>
            <Grid item sm={12} md={8}>
              <div className={dashboardStyles.header2}>Coming Up Soon</div>
              <div className={dashboardStyles.leftCard}>
                <div className={dashboardStyles.cardTitle}>
                  <TutoringCardDisplay sessions={2} />
                </div>
              </div>
              <div className={dashboardStyles.header2}>Assignments</div>

              <List className={dashboardStyles.leftCard} sx={{ backgroundColor: 'white' }}>

                {assignmentList.map(assignment => (
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <ArrowForwardIosIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{backgroundColor: "#F5F7F9"}}>
                        <img src="./AssignmentIcon.svg" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={assignment.name}
                      secondary={assignment.dueDate}
                    />
                  </ListItem>
                ))}
              </List>

              <div className={dashboardStyles.header2}>Events</div>
              <List className={dashboardStyles.leftCard} sx={{ backgroundColor: 'white' }}>

                {eventList.map(assignment => (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{backgroundColor: "#F5F7F9"}}>
                        <img src="./EventIcon.svg" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={assignment.name}
                      secondary={assignment.eventDate}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item sm={12} md={4}>
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
    </ThemeProvider>

  );
}
