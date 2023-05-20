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
import IndividualAssignment from "./IndividualAssignment";

import { getAssignments } from "../../api/routes";

export default function StudentAssignments({user, assignment_id}) {
  const [assignmentList, setAssignmentList] = useState([]);

  useEffect(() => {
    getAssignments(setAssignmentList)
  }, []);
  
  if (assignment_id) {
    return <IndividualAssignment user={user} assignment_id={assignment_id} />
  }

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Box className="headerBox">
            <Typography variant="h1"> Assignments </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          <div className={assignentStyles.leftColumn}>
            {assignmentList.length > 0 &&
              <AssignmentList assignmentList={assignmentList} />
            }
            {assignmentList.length <= 0 &&
              <Typography fontSize='30px' textAlign='center'>
                Nothing&apos;s due! Take some time to relax :)
              </Typography>
            }
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