import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from "@mui/material";
import Image from "next/image";
import TutoringCardDisplay from "../tutoringCard";
import styles from '../../styles/Home.module.css'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from "next/router";
import axios from "axios";
import FAQIcon from "../../public/faq.svg";
import CalendarIcon from "../../public/officehours.svg";
import GreenCircle from "../../public/green.png";
import Cookie from 'js-cookie'
import AssignmentList from "../assignmentsList";

import { getAssignments } from "../../api/routes";

export default function Dashboard(props) {
  const user = props.user
  const router = useRouter()

  // make call to backend to get real data
  const [assignmentList, setAssignmentList] = useState([]);

  useEffect(() => {
    getAssignments(setAssignmentList)
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box className="headerBox">
            <Typography variant="h1"> Hey, {user["firstname"]} 🤟 </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h3">Coming Up Soon</Typography>
          <div className={styles.pageElement}>
            <TutoringCardDisplay />
          </div>

          {assignmentList.length > 0 &&
            <>
              <Typography variant="h3">{assignmentList.length} Assignment{assignmentList.length > 1 && "s"}</Typography>
              <AssignmentList assignmentList={assignmentList} />
            </>
          }

        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h3"> Resources </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6} md={12} lg={6}>
              <div className={styles.question}>
                <Image
                  src={CalendarIcon}
                  alt="OfficeHours"
                  onClick={() => {
                    router.push('/OfficeHours')
                  }}
                  style={{ marginTop: 19, marginBottom: 18 }}
                /><br />
                Office Hours
              </div>
            </Grid>
            <Grid item xs={6} md={12} lg={6}>
              <div className={styles.question}>
                <Image
                  src={FAQIcon}
                  alt="FAQ"
                  onClick={() => {
                    router.push('/FAQBoard')
                  }}
                /><br />
                FAQ Board
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}