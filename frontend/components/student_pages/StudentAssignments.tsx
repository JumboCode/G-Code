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

// styles
import assignentStyles from "../../styles/Assignments.module.css";

export default function StudentAssignments(props) {
  const user = props.user
  const router = useRouter()

  // make call to backend to get real data
  const [assignmentList, setAssignmentList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/assignments', {
      // params: {
      //   student_email: 'user.email',
      // },
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        console.log(response.data)
        setAssignmentList(response.data)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <div className={assignentStyles.header1}>
            <p> Assignments </p>
          </div>
        </Grid>
        <Grid item xs={12} md={9}>
          <div className={assignentStyles.leftColumn}>
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
  </div>
  );
}