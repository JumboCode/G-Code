import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import { DropDownMenu, TimeMenu } from "../components/menus";
import Switch from "@mui/material/Switch";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme.ts";
import {
  Grid,
  Box,
  CssBaseline,
  Modal,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import HeaderNav from "../components/headernav.tsx";
import { DRAWER_WIDTH } from "../constants";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { ArrowRight } from "@mui/icons-material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import TextField from "@mui/material/TextField";

// import StudentScheduling from '../components/StudentScheduling.tsx';

const button_style = { color: "#3D495C" };
const is_student = true;
const steps = [
  {
    label: "Select campaign settings",
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: "Create an ad group",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Create an ad",
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

const tutors = [
  {
    name: "Michelle Minns",
    imageUrl: "NyraRobinson.png",
    times: ["10:30 AM", "11 AM", "11:30 AM", "8 PM", "8:30 PM", "9 PM"],
  },
  {
    name: "Laena Tyler",
    imageUrl: "LaenaTyler.png",
    times: ["7 PM", "7:30 PM", "8 PM", "9 PM", "9:30 PM", "10 PM"],
  },
];

export default function Scheduling() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [topic, setTopic] = React.useState("");
  const [comfort, setComfort] = React.useState("");

  const handleChangeTopic = (event: SelectChangeEvent) => {
    setTopic(event.target.value);
  };

  const handleChangeComfort = (event: SelectChangeEvent) => {
    setComfort(event.target.value);
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <HeaderNav currentPageTitle="Office Hours" />
        <Box
          component="main"
          className={styles.content}
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          }}
        >
          {is_student && (
            <div
              style={{
                paddingTop: "40px",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={9}>
                      <StudentHeading />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Button
                        variant="secondary"
                        sx={{
                          marginTop: "20px",
                        }}
                      >
                        <TuneRoundedIcon />
                        Filters
                      </Button>
                    </Grid>
                  </Grid>
                  <CalendarWeek />
                  <p
                    style={{
                      color: "#61646D",
                    }}
                  >
                    Appointments Available on Tuesday, Nov 22
                  </p>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      width: "90%",
                    }}
                  >
                    {tutors.map((tutor) => (
                      <TutorProfile {...tutor} />
                    ))}
                  </Box>
                  <Button
                    sx={{
                      backgroundColor: "#61646D",
                      width: "90%",
                      marginTop: "20px",
                      color: "white",
                    }}
                    onClick={handleOpen}
                  >
                    Continue →
                  </Button>
                </Grid>

                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box
                    sx={{
                      radius: "25px",

                      height: "30pc",
                      width: "40pc",
                      // display: "flex",
                      padding: "2rem",
                      backgroundColor: "white",
                      margin: "auto",
                    }}
                  >
                    <Box>
                      <Stepper activeStep={activeStep} orientation="vertical">
                        <Step key={"What do you need help with"}>
                          <StepLabel>{"What do you need help with"}</StepLabel>
                          <StepContent>
                            <FormControl sx={{ m: 1, minWidth: 300 }}>
                              <InputLabel id="demo-simple-select-autowidth-label">
                                Select
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={topic}
                                onChange={(event) => {
                                  handleChangeTopic(event);
                                  handleNext();
                                }}
                                autoWidth
                                label="Topic"
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                <MenuItem value={10}>Class Topic</MenuItem>
                                <MenuItem value={21}>Assignment</MenuItem>
                                <MenuItem value={22}>
                                  Getting to Know G-Code{" "}
                                </MenuItem>
                                <MenuItem value={23}>Career Paths </MenuItem>
                                <MenuItem value={24}>
                                  Interview Practice{" "}
                                </MenuItem>
                                <MenuItem value={25}>
                                  Being a Minority in Tech
                                </MenuItem>
                                <MenuItem value={26}>Personal Project</MenuItem>
                              </Select>
                            </FormControl>
                            <Box sx={{ mb: 2 }}>
                              <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ mt: 1, mr: 1 }}
                              >
                                Continue
                              </Button>
                            </Box>
                          </StepContent>
                        </Step>
                        <Step key={"How do you feel about this topic?"}>
                          <StepLabel>
                            {"How do you feel about this topic?"}
                          </StepLabel>
                          <StepContent>
                            <Box sx={{ mb: 2 }}>
                              <div>
                                <Button
                                  variant="outlined"
                                  onClick={(event) => {
                                    handleChangeComfort(event);
                                    handleNext();
                                  }}
                                  sx={{ mt: 1, mr: 1 }}
                                >
                                  Good - have a quick question
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={(event) => {
                                    handleChangeComfort(event);
                                    handleNext();
                                  }}
                                  sx={{ mt: 1, mr: 1 }}
                                >
                                  Confused - need some help
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={(event) => {
                                    handleChangeComfort(event);
                                    handleNext();
                                  }}
                                  sx={{ mt: 1, mr: 1 }}
                                >
                                  I'm so lost (and that;s okay!)
                                </Button>
                              </div>
                              <div>
                                <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  sx={{ mt: 1, mr: 1 }}
                                >
                                  Continue
                                </Button>
                                <Button
                                  onClick={handleBack}
                                  sx={{ mt: 1, mr: 1 }}
                                >
                                  Back
                                </Button>
                              </div>
                            </Box>
                          </StepContent>
                        </Step>
                        <Step key={"What do you feel stuck on?"}>
                          <StepLabel>{"What do you feel stuck on?"}</StepLabel>
                          <StepContent>
                            <Box sx={{ mb: 2 }}>
                              <div>
                                <TextField
                                  fullWidth
                                  id="outlined-multiline-static"
                                  label="Tell us what you'd like to go over in this session"
                                  multiline
                                  rows={4}
                                  defaultValue=""
                                />
                                <div>
                                  <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                  >
                                    Finish
                                  </Button>
                                </div>
                              </div>
                            </Box>
                          </StepContent>
                        </Step>
                      </Stepper>
                      {activeStep === steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                          <p>All steps completed - you&apos;re finished</p>
                          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                            Reset
                          </Button>
                        </Paper>
                      )}
                    </Box>
                  </Box>
                </Modal>

                <Grid item xs={12} md={4}>
                  {/* <Grid container spacing={1}>
                                        <Grid item xs={12}> */}
                  <p>Can't find a time?</p>
                  {/* </Grid>
                                    </Grid> */}
                  {/* <Grid item xs={12}> */}
                  <Button variant="secondary">+ Suggest New Times</Button>
                  {/* </Grid> */}
                  {/* <Grid item xs={12}> */}
                  <Button variant="secondary">Check FAQ Board &#8594;</Button>
                  {/* </Grid> */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={9}>
                      <p>Work Together</p>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Button variant="secondary">+ New</Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          )}
          {!is_student && (
            <div style={tutoring_styles.ScheduleContainer}>
              <PageHeading />
              <AvailableSessionsSection />
              <h2 style={{ ...tutoring_styles.SubHeading }}>
                Available Times for Signup
              </h2>

              <TableContainer className={styles.pageElement} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    {days.map((day) => (
                      <DayRow dayName={day} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function StudentHeading() {
  return (
    <h2
      style={{
        fontFamily: "Poppins",
        color: "#29395B",
      }}
    >
      Got questions? Ask us!
    </h2>
  );
}

function CalendarWeek() {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        width: "90%",
        boxShadow: "2px 2px 10px 2px rgba(142, 142, 142, 0.1)",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <ArrowLeftIcon />
      <CalendarDay dayName="Mon" dayNum={21} selected={false} />
      <CalendarDay dayName="Tues" dayNum={22} selected />
      <CalendarDay dayName="Wed" dayNum={23} selected={false} />
      <CalendarDay dayName="Thur" dayNum={24} selected={false} />
      <CalendarDay dayName="Fri" dayNum={25} selected={false} />
      <CalendarDay dayName="Sat" dayNum={26} selected={false} />
      <CalendarDay dayName="Sun" dayNum={27} selected={false} />
      <ArrowRightIcon />
    </Box>
  );
}

function CalendarDay({ dayName, dayNum, selected }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: selected ? "2px solid #6A5DF9" : "",
        backgroundColor: selected ? "#F0EFFE" : "white",
        borderRadius: "10px",
        padding: "0 20px",
        margin: "8px 0",
      }}
    >
      <p
        style={{
          color: selected ? "#6A5DF9" : "#29395B",
          fontSize: "14px",
        }}
      >
        {dayName}
      </p>
      <p
        style={{
          color: selected ? "#6A5DF9" : "#29395B",
          fontSize: "14px",
        }}
      >
        <b>{dayNum}</b>
      </p>
    </Box>
  );
}

function TutorProfile({ name, imageUrl, times }) {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        boxShadow: "2px 2px 15px rgba(194, 194, 194, 0.2)",
        borderRadius: "10px",
        padding: "10px",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={3.5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p>{name}</p>
            <img src={imageUrl} />
            <Button
              sx={{
                color: "#29395B",
                backgroundColor: "#F6F6F6",
                padding: "5px 15px",
                marginTop: "10px",
              }}
            >
              View Profile
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={2.5}>
          <TimeBox time={times[0]} />
          <TimeBox time={times[3]} />
        </Grid>
        <Grid item xs={12} md={2.5}>
          <TimeBox time={times[1]} />
          <TimeBox time={times[4]} />
        </Grid>
        <Grid item xs={12} md={2.5}>
          <TimeBox time={times[2]} />
          <TimeBox time={times[5]} />
        </Grid>
      </Grid>
    </Box>
  );
}

function TimeBox({ time }) {
  return (
    <Box
      sx={{
        border: "1px solid #D8D8DB",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <p style={{ color: "#29395B", textAlign: "center" }}>{time}</p>
    </Box>
  );
}

function PageHeading() {
  return (
    <div style={tutoring_styles.PageHeadingContainer}>
      <h1>Office Hours Schedule</h1>
      {/* <h3 style={tutoring_styles.TimeZone}> Time Zone </h3> */}
      <DropDownMenu width={"auto"} options={["Eastern Time", "Pacific Time"]} />
      <div style={tutoring_styles.CheckBox}>
        <Checkbox disableRipple />
        <p>Make this the default schedule</p>
      </div>
    </div>
  );
}

function AvailableSessionsSection() {
  return (
    <div style={tutoring_styles.AvailableSessionsContainer}>
      <h2 style={tutoring_styles.SubHeading}>Available Sessions</h2>
      <DropDownMenu
        width="110px"
        options={[
          "1 slot",
          "2 slots",
          "3 slots",
          "4 slots",
          "5 slots",
          "6 slots",
          "7 slots",
          "8 slots",
          "9 slots",
          "10 slots",
        ]}
      />
    </div>
  );
}

function DayRow({ dayName }) {
  const [numTimeIntervals, setNumTimeIntervals] = useState(1);
  return (
    <TableRow key={dayName} sx={{ borderColor: "white" }}>
      <TableCell
        sx={{ borderColor: "white", padding: "2px" }}
        component="th"
        scope="row"
      >
        <h2 style={tutoring_styles.DayName}>{dayName}</h2>
      </TableCell>
      <TableCell sx={{ borderColor: "white", padding: "2px" }} align="right">
        <div style={tutoring_styles.SwitchContainer}>
          <Switch
            checked={numTimeIntervals > 0}
            onChange={(event) =>
              setNumTimeIntervals((old) => (old == 0 ? 1 : 0))
            }
          />
        </div>
      </TableCell>
      <TableCell sx={{ borderColor: "white", padding: "2px" }} align="right">
        {Array(numTimeIntervals)
          .fill(0)
          .map((_, index) => (
            <TimeIntervalSelector
              bottom={index === numTimeIntervals - 1}
              key={index}
              setNumTimeIntervals={setNumTimeIntervals}
            />
          ))}
      </TableCell>
    </TableRow>
  );
}

function TimeIntervalSelector({ bottom, setNumTimeIntervals }) {
  return (
    <div style={tutoring_styles.TimeIntervalSelector}>
      <TimeMenu />
      TO
      <TimeMenu />
      {bottom && (
        <>
          <IconButton onClick={() => setNumTimeIntervals((old) => old + 1)}>
            <AddRoundedIcon sx={button_style} />
          </IconButton>
          <IconButton
            onClick={() => {
              setNumTimeIntervals((old) => old - 1);
            }}
          >
            <DeleteOutlineOutlinedIcon sx={button_style} />
          </IconButton>
        </>
      )}
    </div>
  );
}

const tutoring_styles = {
  PageHeadingContainer: {
    paddingTop: "50px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "3%",
  },
  DayRow: {
    display: "flex",
    flexDirection: "row",
    height: "auto",
    gap: "1%",
    marginLeft: "10px",
  },
  DayName: {
    fontSize: "19px",
    lineHeight: "25px",
    fontFamily: "Red Hat Display",
  },
  WeekContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #DFDFDF",
    backgroundColor: "white",
    borderRadius: "20px",
  },
  ScheduleContainer: {
    display: "flex",
    flexDirection: "column",
  },
  DayNameContainer: {
    width: "10%",
    height: "50px",
  },
  CheckBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "right",
    alignItems: "right",
    marginLeft: "auto",
    fontFamily: "Poppins",
  },
  TimeZone: {
    fontFamily: "Poppins",
    fontSize: "18px",
    marginRight: "0px",
  },
  SwitchContainer: {
    display: "flex",
    alignItems: "center",
    height: "50px",
    width: "10%",
  },
  TimeIntervalSelector: {
    display: "flex",
    gap: "3%",
    width: "400px",
    alignItems: "center",
    height: "50px",
  },
  TimeIntervalStack: {
    display: "flex",
    flexDirection: "column",
  },
  AvailableSessionsContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  SubHeading: {
    fontSize: "18px",
  },
};
