import React, { useState, useEffect } from "react";
import { Grid, Box, Modal, Button, Typography, TextField, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from "@mui/material";
import TutoringCardDisplay from "../tutoringCard";
import styles from "../../styles/Home.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import FAQIcon from "../../public/faq.svg";
import CalendarIcon from "../../public/officehours.svg";
import GreenCircle from "../../public/green.png";
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CreateAssignmentModal from '../createAssignmentModal'

export default function Dashboard(props) {
  const user = props.user;
  const router = useRouter();
  // add assignment modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // Get new assignment data
  // make call to backend to get real data

  return (
    <>
      <CreateAssignmentModal open={open} handleClose={handleClose} />
      <Grid container spacing={2}>

        <Grid className={styles.header1} item xs={12}>
          <Box className="headerBox">
            <Typography variant="h1"> Hey, {user["firstname"]} 🤟 </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <div className={styles.header2}>Coming Up Soon</div>
          <div className={styles.pageElement}>
            <TutoringCardDisplay />
          </div>
          <Grid container columnSpacing={2} padding={1}>
            <Grid item xs={12} md={6}>
              <div className={styles.question}>
                <PeopleIcon
                  onClick={() => {
                    router.push("/People");
                  }}
                  sx={icon_style}
                />
                <br />
                View People
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={styles.question}>
                <PersonAddIcon
                  onClick={() => {
                    router.push("/People");
                  }}
                  sx={icon_style}
                />
                <br />
                Add People
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={styles.question}>
                <AssignmentIcon
                  onClick={() => {
                    router.push("/Assignments");
                  }}
                  sx={icon_style}
                />
                <br />
                View Assignments
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={styles.question}>
                <PostAddIcon
                  onClick={handleOpen}
                  sx={icon_style}
                />
                <br />
                Add Assignment
              </div>
              
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className={styles.header2}> Resources </div>
          <Grid container spacing={2}>
            <Grid item xs={6} md={12} lg={6}>
              <div className={styles.question}>
                <Image
                  src={CalendarIcon}
                  alt="Office Hours"
                  onClick={() => {
                    router.push("/OfficeHours");
                  }}
                  style={{marginTop: 19, marginBottom: 18}}
                />
                <br />
                Office Hours
              </div>
            </Grid>
            <Grid item xs={6} md={12} lg={6}>
              <div className={styles.question}>
                <Image
                  src={FAQIcon}
                  alt="FAQ Board"
                  onClick={() => {
                    router.push("/FAQBoard");
                  }}
                />
                <br />
                FAQ Board
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

const icon_style = {
  fontSize: 120,
  color: 'white'
}