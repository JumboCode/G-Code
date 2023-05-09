import React, { useState, useEffect } from "react";
import { Grid, Box, Modal, Button, Typography, TextField, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TutoringCardDisplay from "../tutoringCard";
import styles from "../../styles/Home.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import FAQIcon from "../../public/faq.svg";
import CalendarIcon from "../../public/officehours.svg";
import GreenCircle from "../../public/green.png";
import dayjs, { Dayjs } from 'dayjs';

import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PostAddIcon from '@mui/icons-material/PostAdd';

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
  // Get new assignment data
  const [assignmentName, setAssignmentName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [assignmentDue, setAssignmentDue] = React.useState(dayjs(new Date()));
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

  //Save appointment
  const saveAssignment = () => {
    const info = {
      name: assignmentName,
      description: description,
      dueDate: assignmentDue,
    };

    axios.post('http://localhost:8000/api/create_assignment', info);
  }

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
                    value={assignmentName}
                    onChange = {(event) => setAssignmentName(event.target.value)}
                  />
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Assignment Details"
                    multiline
                    maxRows={20}
                    minRows={5}
                    variant="outlined"
                    sx={{ marginBottom: "10px" }}
                    value = {description}
                    onChange = {(event) => setDescription(event.target.value)}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                    value={assignmentDue}
                    onChange = {(newValue) => setAssignmentDue(newValue)}
                    label="Due Date" />
                    </LocalizationProvider>
                  <Button
                  sx={{marginTop: "10px"}}
                  variant="contained"
                  size="large"
                  onClick={() => {
                    saveAssignment();
                  }}
                  >
                  Submit
                  </Button>
                  <Button
                  variant="outlined"
                  sx={{marginTop: "10px", marginLeft: "10px"}}
                  size="large"
                  onClick={handleClose}>
                    Cancel
                  </Button>
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
                sx={{ marginTop: '15px', backgroundColor: "white" }}
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
                        <Image src={GreenCircle} alt="Assignment" />
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