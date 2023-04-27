import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from "@mui/material"; 
import Image from "next/image";
import TutoringCardDisplay from "../tutoringCard";
import styles from '../../styles/Home.module.css'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from "next/router";
import axios from "axios";
import FAQIcon from "../../public/questionmark.png";
import CalendarIcon from "../../public/calendar.jpg";
import GreenCircle from "../../public/green.png";

export default function Dashboard(props) {
  const user = props.user
  const router = useRouter()

  // make call to backend to get real data
  const [assignmentList, setAssignmentList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/assignments', {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        setAssignmentList(response.data)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid className={styles.header1} item xs={12}>
          {/* get a firstname from backend */}
          <p> Hey, {user["firstname"]} 🤟 </p>
        </Grid>
        <Grid item xs={12} md={8}>
          <div className={styles.header2}>Coming Up Soon</div>
          <div className={styles.pageElement}>
            <TutoringCardDisplay />
          </div>

          {assignmentList.length > 0 &&
            <>
              <div className={styles.header2}>{assignmentList.length} Assignment{assignmentList.length > 1 && "s"}</div>


              <List className={styles.pageElement} sx={{ backgroundColor: 'white' }}>
                {assignmentList.map(assignment => (
                  <ListItem
                    key={assignment.name}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => {
                        router.push('/Assignments')
                      }}>
                        <ArrowForwardIosIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: "#F5F7F9" }}>
                        <Image src={GreenCircle} alt="Assignment Icon" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={assignment.name}
                      secondary={assignment.dueDate}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          }

        </Grid>
        <Grid item xs={12} md={4}>
          <div className={styles.header2}> Resources </div>

          <Grid container spacing={2}>
            <Grid item xs={6} md={12} lg={6}>
              <div className={styles.question}>
                <Image src={CalendarIcon} alt="OfficeHours" onClick={() => {
                  router.push('/OfficeHours')
                }} /><br />
                Office Hours
              </div>
            </Grid>
            <Grid item xs={6} md={12} lg={6}>
              <div className={styles.question}>
                <Image src={FAQIcon} alt="FAQ" onClick={() => {
                  router.push('/FAQBoard')
                }} /><br />
                FAQ Board
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
