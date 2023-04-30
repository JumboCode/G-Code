import React, { useState, useEffect } from "react";
import { Grid, Box, Modal, Typography, TextField, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TutoringCardDisplay from "../tutoringCard";
import styles from "../../styles/Home.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import FAQIcon from "../../public/questionmark.png";
import CalendarIcon from "../../public/calendar.jpg";
import AssignmentIcon from "../../public/assignments.jpg";
import AddAssignmentIcon from "../../public/addassignment.png";
import PeopleIcon from "../../public/people.png";
import AddPersonIcon from "../../public/addperson.png";
import GreenCircle from "../../public/green.png";

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
                <Image
                  src={PeopleIcon}
                  alt="View Students"
                  onClick={() => {
                    router.push("/People");
                  }}
                />
                <br />
                View Students
              </div>
            </Grid>
            <Grid item xs={6} md={12} lg={4}>
              <div className={styles.question}>
                <Image
                  src={PeopleIcon}
                  alt="View Instructors"
                  onClick={() => {
                    router.push("/People");
                  }}
                />
                <br />
                View Instructors
              </div>
            </Grid>
            <Grid item xs={6} md={12} lg={4}>
              <div className={styles.question}>
                <Image
                  src={AssignmentIcon}
                  alt="View Assignments"
                  onClick={() => {
                    router.push("/Assignments");
                  }}
                />
                <br />
                View Assignments
              </div>
            </Grid>
            <Grid item xs={6} md={12} lg={4}>
              <div className={styles.question}>
                <Image
                  src={AddPersonIcon}
                  alt="People"
                  onClick={() => {
                    router.push("/People");
                  }}
                />
                <br />
                Add Student
              </div>
            </Grid>
            <Grid item xs={6} md={12} lg={4}>
              <div className={styles.question}>
                <Image
                  src={AddPersonIcon}
                  alt="Add Instructor"
                  onClick={() => {
                    router.push("/Dashbaord");
                  }}
                />
                <br />
                Add Instructor
              </div>
            </Grid>
            <Grid item xs={6} md={12} lg={4}>
              <div className={styles.question}>
                <Image src={AddAssignmentIcon} alt="Add Assignment" onClick={handleOpen} />
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
                        <Image src={GreenCircle} alt="Assignment"/>
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