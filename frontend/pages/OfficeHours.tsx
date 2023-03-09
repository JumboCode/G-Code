import React, { useState } from 'react';
import styles from '../styles/Home.module.css'
import { DropDownMenu, TimeMenu } from '../components/menus'
import Switch from '@mui/material/Switch';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme.ts'
import { Grid, Box, CssBaseline } from "@mui/material";
import HeaderNav from '../components/headernav.tsx';
import { DRAWER_WIDTH } from '../constants';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { ArrowRight } from '@mui/icons-material';
// import StudentScheduling from '../components/StudentScheduling.tsx';
import GetUserPermission from "../components/permissions";
import IsUserAuthorized from "../components/authentification";

const button_style = { color: '#3D495C' };

// Don't forget to take this out
var is_student = true


const tutors = [{
  name: 'Michelle Minns',
  imageUrl: 'NyraRobinson.png',
  times: ['10:30 AM', '11 AM', '11:30 AM', '8 PM', '8:30 PM', '9 PM']
}, {
  name: 'Laena Tyler',
  imageUrl: 'LaenaTyler.png',
  times: ['7 PM', '7:30 PM', '8 PM', '9 PM', '9:30 PM', '10 PM']
}]

export default function Scheduling() {

    const [user, setUser] = useState(null);
    const get_user = curr_user => {
        if (user == null) {
            setUser(curr_user)
        }
    }

    IsUserAuthorized("Student", get_user)
    console.log(user)
    if (user != null && user["permission_level"] == "Admin") {
        is_student = false;
    }

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    if (user == null) {
        return <p> Loading... </p>
    } else return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <HeaderNav currentPageTitle="Office Hours" />
                <Box
                    component="main"
                    className={styles.content}
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
                >
                    {
                        is_student &&
                        <div style={{
                            paddingTop: '40px'
                        }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={9}>
                                            <StudentHeading />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Button variant="secondary" sx={{
                                                marginTop: '20px'
                                            }}>
                                                <TuneRoundedIcon />
                                                Filters
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <CalendarWeek />
                                    <p style={{
                                        color: '#61646D',
                                    }}>
                                        Appointments Available on Tuesday, Nov 22
                                    </p>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                        width: '90%'
                                    }}>
                                        {tutors.map((tutor) => <TutorProfile {...tutor} />)}
                                    </Box>
                                    <Button sx={{
                                        backgroundColor: '#61646D',
                                        width: '90%',
                                        marginTop: '20px',
                                        color: 'white'
                                    }}>
                                        Continue →
                                    </Button>
                                </Grid>

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
          }
          {
            !is_student &&
            <div style={tutoring_styles.ScheduleContainer}>
              <PageHeading />
              <AvailableSessionsSection />
              <h2 style={{ ...tutoring_styles.SubHeading }}>
                Available Times for Signup
              </h2>

              <TableContainer className={styles.pageElement} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    {
                      days.map(day => (
                        <DayRow dayName={day} />
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          }
        </Box>
      </Box>
    </ThemeProvider>
  )
}


function StudentHeading() {
  return <h2 style={{
    fontFamily: 'Poppins',
    color: '#29395B',
  }}>Got questions? Ask us!</h2>
}

function CalendarWeek() {
  return <Box sx={{
    backgroundColor: 'white',
    width: '90%',
    boxShadow: '2px 2px 10px 2px rgba(142, 142, 142, 0.1)',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  }}>
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
}

function CalendarDay({ dayName, dayNum, selected }) {
  return <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: selected ? '2px solid #6A5DF9' : '',
    backgroundColor: selected ? '#F0EFFE' : 'white',
    borderRadius: '10px',
    padding: '0 20px',
    margin: '8px 0'
  }}>
    <p style={{
      color: selected ? '#6A5DF9' : '#29395B',
      fontSize: '14px'
    }}>
      {dayName}
    </p>
    <p style={{
      color: selected ? '#6A5DF9' : '#29395B',
      fontSize: '14px',
    }}>
      <b>{dayNum}</b>
    </p>
  </Box>
}

function TutorProfile({ name, imageUrl, times }) {
  return <Box sx={{
    backgroundColor: 'white',
    boxShadow: '2px 2px 15px rgba(194, 194, 194, 0.2)',
    borderRadius: '10px',
    padding: '10px',
  }}>
    <Grid container spacing={2}>
      <Grid item xs={12} md={3.5}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <p>{name}</p>
          <img src={imageUrl} />
          <Button sx={{
            color: '#29395B',
            backgroundColor: '#F6F6F6',
            padding: '5px 15px',
            marginTop: '10px'
          }}>
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
}

function TimeBox({ time }) {
  return <Box sx={{
    border: '1px solid #D8D8DB',
    borderRadius: '12px',
    marginTop: '20px',
  }}>
    <p style={{ color: '#29395B', textAlign: 'center' }}>
      {time}
    </p>
  </Box>
}

function PageHeading() {
  return (
    <div style={tutoring_styles.PageHeadingContainer}>
      <h1>Office Hours Schedule</h1>
      {/* <h3 style={tutoring_styles.TimeZone}> Time Zone </h3> */}
      <DropDownMenu
        width={'auto'}
        options={[
          'Eastern Time',
          'Pacific Time',
        ]} />
      <div style={tutoring_styles.CheckBox}>
        <Checkbox disableRipple />
        <p>Make this the default schedule</p>
      </div>
    </div>
  )
}

function AvailableSessionsSection() {
  return (
    <div style={tutoring_styles.AvailableSessionsContainer}>
      <h2 style={tutoring_styles.SubHeading}>
        Available Sessions
      </h2>
      <DropDownMenu
        width="110px"
        options={[
          '1 slot',
          '2 slots',
          '3 slots',
          '4 slots',
          '5 slots',
          '6 slots',
          '7 slots',
          '8 slots',
          '9 slots',
          '10 slots',
        ]} />
    </div>
  )
}

function DayRow({ dayName }) {
  const [numTimeIntervals, setNumTimeIntervals] = useState(1);
  return (
    <TableRow
      key={dayName}
      sx={{ borderColor: 'white' }}
    >
      <TableCell sx={{ borderColor: 'white', padding: '2px' }} component="th" scope="row">
        <h2 style={tutoring_styles.DayName}>
          {dayName}
        </h2>
      </TableCell>
      <TableCell sx={{ borderColor: 'white', padding: '2px' }} align="right">
        <div style={tutoring_styles.SwitchContainer}>
          <Switch checked={numTimeIntervals > 0} onChange={
            (event) => setNumTimeIntervals((old) => (old == 0 ? 1 : 0))
          } />
        </div>
      </TableCell>
      <TableCell sx={{ borderColor: 'white', padding: '2px' }} align="right">
        {Array(numTimeIntervals).fill(0).map((_, index) =>
          <TimeIntervalSelector
            bottom={index === (numTimeIntervals - 1)}
            key={index}
            setNumTimeIntervals={setNumTimeIntervals} />
        )}
      </TableCell>
    </TableRow>
  );
}

function TimeIntervalSelector({ bottom, setNumTimeIntervals }) {
  return <div style={tutoring_styles.TimeIntervalSelector}>
    <TimeMenu />
    TO
    <TimeMenu />
    {bottom && <>
      <IconButton onClick={() => setNumTimeIntervals((old) => old + 1)}>
        <AddRoundedIcon sx={button_style} />
      </IconButton>
      <IconButton onClick={() => {
        setNumTimeIntervals((old) => old - 1);
      }}>
        <DeleteOutlineOutlinedIcon sx={button_style} />
      </IconButton>
    </>}
  </div>
}

const tutoring_styles = ({
  PageHeadingContainer:
  {
    paddingTop: '50px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '3%'
  },
  DayRow:
  {
    display: 'flex',
    flexDirection: 'row',
    height: 'auto',
    gap: '1%',
    marginLeft: '10px'
  },
  DayName:
  {
    fontSize: '19px',
    lineHeight: '25px',
    fontFamily: 'Red Hat Display',
  },
  WeekContainer:
  {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #DFDFDF',
    backgroundColor: 'white',
    borderRadius: '20px'
  },
  ScheduleContainer:
  {
    display: 'flex',
    flexDirection: 'column',
  },
  DayNameContainer:
  {
    width: '10%',
    height: '50px'
  },
  CheckBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'right',
    alignItems: 'right',
    marginLeft: 'auto',
    fontFamily: 'Poppins',
  },
  TimeZone: {
    fontFamily: 'Poppins',
    fontSize: '18px',
    marginRight: '0px',
  },
  SwitchContainer:
  {
    display: 'flex',
    alignItems: 'center',
    height: '50px',
    width: '10%'
  },
  TimeIntervalSelector:
  {
    display: 'flex',
    gap: '3%',
    width: '400px',
    alignItems: 'center',
    height: '50px'
  },
  TimeIntervalStack:
  {
    display: 'flex',
    flexDirection: 'column',
  },
  AvailableSessionsContainer:
  {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px'
  },
  SubHeading:
  {
    fontSize: '18px'
  },
})
