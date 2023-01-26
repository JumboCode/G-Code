import React, { useState } from 'react';
import Sidebar from '../components/sidebar'
import styles from '../styles/Home.module.css'
import Select from '@mui/material/Select'
import { DropDownMenu, TimeMenu } from './Menus'
import Switch from '@mui/material/Switch';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Heading from '../components/heading'
import Help from '../components/help'
import Filter from '../components/filter'
import Booking from '../components/booking'

import { Box, CssBaseline } from "@mui/material";
import HeaderNav from '../components/headernav.tsx';

const button_style = { color: '#3D495C' };
const is_student = false
const drawerWidth = 240

export default function Scheduling() {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <HeaderNav />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          {
            is_student &&
            <div>
              <Filter />
              <Help />
            </div>
          }
          {
            !is_student &&
            <div className={styles.container}>
              <div style={tutoring_styles.ScheduleContainer}>
                <PageHeading />
                <AvailableSessionsSection />
                <h2 style={{ ...tutoring_styles.SubHeading, marginLeft: '3vw' }}>
                  Available Times for Signup
                </h2>
                <div style={tutoring_styles.WeekContainer}>
                  <DayRow dayName="Sunday" />
                  <DayRow dayName="Monday" />
                  <DayRow dayName="Tuesday" />
                  <DayRow dayName="Wednesday" />
                  <DayRow dayName="Thursday" />
                  <DayRow dayName="Friday" />
                  <DayRow dayName="Saturday" />

                </div>
              </div>
            </div>
          }
        </Box>
      </Box>
    </>
  )
}

function PageHeading() {
  return (
    <div style={tutoring_styles.PageHeadingContainer}>
      <h1>Office Hours Schedule</h1>
      <h3 style={tutoring_styles.TimeZone}> Time Zone </h3>
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

// function MeetingDuration() {
//   return <div>
//     <h2> Duration </h2>
//     <div style={tutoring_styles.TimeContainer}>
//       <h3 style={tutoring_styles.TimeBox} > 30 Minutes </h3>
//       <h3 style={tutoring_styles.TimeBox}> 40 Minutes </h3>
//       <h3 style={tutoring_styles.TimeBox}> 60 Minutes </h3>
//       <h3 style={tutoring_styles.TimeBox} > 120 Minutes </h3>
//     </div>
//   </div>
// }

function DayRow({ dayName }) {
  const [numTimeIntervals, setNumTimeIntervals] = useState(1);
  return <div style={tutoring_styles.DayRow}>
    <div style={tutoring_styles.DayNameContainer}>
      <h2 style={tutoring_styles.DayName}>
        {dayName}
      </h2>
    </div>
    <div style={tutoring_styles.SwitchContainer}>
      <Switch checked={numTimeIntervals > 0} onChange={
        (event) => setNumTimeIntervals((old) => (old == 0 ? 1 : 0))
      } />
      <p>{numTimeIntervals > 0 ? 'Open' : 'Closed'}</p>
    </div>
    <div style={tutoring_styles.TimeIntervalStack}>
      {Array(numTimeIntervals).fill(0).map((_, index) =>
        <TimeIntervalSelector
          bottom={index === (numTimeIntervals - 1)}
          key={index}
          setNumTimeIntervals={setNumTimeIntervals} />
      )}
    </div>
  </div>;
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
    marginLeft: '3vw',
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
    // width: 'auto',
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
    // display: 'inline-block',
    // position: 'relative',
    // width: '1071.91px',
    width: '80vw',
    marginLeft: '3vw',
    // height: '524.64px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #DFDFDF',
    // width: 'auto'
  },
  ScheduleContainer:
  {
    // width: '100%',
    // backgroundColor: 'yellow',
    display: 'flex',
    flexDirection: 'column',
    //justifyContent: 'center',
    //alignItems: 'center',
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
    marginLeft: '3vw',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px'
  },
  SubHeading:
  {
    fontSize: '18px'
  }
})
