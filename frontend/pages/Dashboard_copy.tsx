import React from "react";
import { Grid, Box, CssBaseline, Button } from "@mui/material";
import HeaderNav from '../components/headernav.tsx';
import { DRAWER_WIDTH } from "../constants";
import TutoringCardDisplay from "../components/tutoringCard";
import styles from '../styles/Home.module.css'
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme.ts'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CommunityResourcesPanel from "../components/communityResourcesPanel";
import { useState } from 'react';
import IsUserAuthorized from "../components/authentification";

export default function Dashboard() {

  const [user, setUser] = useState(null);
  const get_user = curr_user => {
    if (user == null){
      setUser(curr_user)
    }
  }
  /* Authorize user and return user 
   * information (ex. first name, username, ect.) */
  IsUserAuthorized("Student", get_user)

  if (user == null){
    return <p> Loading... </p>
  } else return (
    <ThemeProvider theme={theme}>
      <Box className={styles.content} sx={{ display: 'flex' }}>
        <CssBaseline />
        <HeaderNav currentPageTitle="Dashboard Admin" />

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
        >
          <Grid>
            
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
