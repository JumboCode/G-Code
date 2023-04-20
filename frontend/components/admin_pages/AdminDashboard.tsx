import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  CssBaseline,
  Button,
  Modal,
  Typography,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
export default function Dashboard(props) {
  const user = props.user;
  const router = useRouter();
  // add assignment modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
          <p> Hey, {user["firstname"]} :i_love_you_hand_sign: </p>
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
                <img src="FAQBoardIcon.svg" onClick={handleOpen} />
                <br />
                Add Assignment
              </div>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={modalStyle}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Add an Assignment
                  </Typography>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Assignment Title"
                    variant="outlined"
                    sx={{ marginBottom: "10px" }}
                  />
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Assignment Details"
                    multiline
                    maxRows={20}
                    variant="outlined"
                    sx={{ marginBottom: "10px" }}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="Due Date" />
                  </LocalizationProvider>
                </Box>
              </Modal>
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