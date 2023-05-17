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
import Cookie from 'js-cookie'
import Link from 'next/link'

import { formatAMPM, dateToString } from "../../constants";

// styles
import assignentStyles from "../../styles/Assignments.module.css";
import AssignmentList from "../assignmentsList";

export default function StudentAssignments(props) {
  const user = props.user
  const router = useRouter()

  // make call to backend to get real data
  const [assignmentList, setAssignmentList] = useState([]);

  const getAssignments = () => {
    const apiUrl = 'http://localhost:8000/api/assignments';

    const token = Cookie.get('gcode-session')

    const headers = {
      'accept': 'application/json',
      'Authorization': 'Bearer ' + token,
    };

    axios.get(apiUrl, { headers })
      .then(response => {
        setAssignmentList(response.data)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    getAssignments()
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
            <AssignmentList assignmentList={assignmentList} />
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