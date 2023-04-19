import React, { useState, useEffect } from "react";
import { Grid, Box, CssBaseline, Button } from "@mui/material";
import TutoringCardDisplay from "../tutoringCard";
import styles from "../../styles/Home.module.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CommunityResourcesPanel from "../communityResourcesPanel";
import { useRouter } from "next/router";
import axios from "axios";

export default function Dashboard(props) {
  const user = props.user;
  const router = useRouter();

  // make call to backend to get real data
  const [assignmentList, setAssignmentList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/assignments", {
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        setAssignmentList(response.data);
      })
      .catch((error) => {
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

          <Grid container columnSpacing={2} padding={1}>
            <Grid item xs={6} md={12} lg={4}>
              <div className={styles.question}>
                <img
                  src="FAQBoardIcon.svg"
                  onClick={() => {
                    router.push("/FAQBoard");
                  }}
                />
                <br />
                View Students
              </div>
            </Grid>

            <Grid item xs={6} md={12} lg={4}>
              <div className={styles.question}>
                <img
                  src="FAQBoardIcon.svg"
                  onClick={() => {
                    router.push("/FAQBoard");
                  }}
                />
                <br />
                View Instructors
              </div>
            </Grid>

            <Grid item xs={6} md={12} lg={4}>
              <div className={styles.question}>
                <img
                  src="FAQBoardIcon.svg"
                  onClick={() => {
                    router.push("/FAQBoard");
                  }}
                />
                <br />
                View Classes
              </div>
            </Grid>

            <Grid item xs={6} md={12} lg={4}>
              <div className={styles.question}>
                <img
                  src="FAQBoardIcon.svg"
                  onClick={() => {
                    router.push("/FAQBoard");
                  }}
                />
                <br />
                Add Class
              </div>
            </Grid>

            <Grid item xs={6} md={12} lg={4}>
              <div className={styles.question}>
                <img
                  src="FAQBoardIcon.svg"
                  onClick={() => {
                    router.push("/FAQBoard");
                  }}
                />
                <br />
                Add Student
              </div>
            </Grid>
            <Grid item xs={6} md={12} lg={4}>
              <div className={styles.question}>
                <img
                  src="FAQBoardIcon.svg"
                  onClick={() => {
                    router.push("/FAQBoard");
                  }}
                />
                <br />
                Add Assignment
              </div>
            </Grid>
          </Grid>

          {assignmentList.length > 0 && (
            <>
              <div className={styles.header2}>
                {assignmentList.length} Assignment
                {assignmentList.length > 1 && "s"}
              </div>

              <List
                className={styles.pageElement}
                sx={{ backgroundColor: "white" }}
              >
                {assignmentList.map((assignment) => (
                  <ListItem
                    key={assignment.name}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          router.push("/Assignments");
                        }}
                      >
                        <ArrowForwardIosIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: "#F5F7F9" }}>
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
            </>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <div className={styles.header2}> Schedule OH </div>

          <Grid container spacing={2}>
            <Grid item xs={6} md={12} lg={6}>
              <div className={styles.question}>
                <img
                  src="FAQBoardIcon.svg"
                  onClick={() => {
                    router.push("/OfficeHours");
                  }}
                />
                <br />
                FAQ Board
                {/* NEED TO ADD PROPER LINK: GOES TO FAQBOARD */}
              </div>
            </Grid>
            <Grid item xs={6} md={12} lg={6}>
              <div className={styles.question}>
                <img
                  src="FAQBoardIcon.svg"
                  onClick={() => {
                    router.push("/FAQBoard");
                  }}
                />
                <br />
                FAQ Board
              </div>
            </Grid>
          </Grid>

          <CommunityResourcesPanel />
        </Grid>
      </Grid>
    </>
  );
}
