import React, { useState } from 'react';
import Sidebar from '../components/sidebar'
import styles from '../styles/Home.module.css'
import Select from '@mui/material/Select'
import { DropDownMenu, TimeMenu } from '../components/menus'
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
import { DRAWER_WIDTH } from '../constants';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const button_style = { color: '#3D495C' };
const is_student = false

export default function Scheduling() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <>
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
            <div>
              <Filter />
              <Help />
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

              {/* <div className={styles.pageElement}>
                <DayRow dayName="Sunday" />
                <DayRow dayName="Monday" />
                <DayRow dayName="Tuesday" />
                <DayRow dayName="Wednesday" />
                <DayRow dayName="Thursday" />
                <DayRow dayName="Friday" />
                <DayRow dayName="Saturday" />
              </div> */}
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

function DayRow({ dayName }) {
  const [numTimeIntervals, setNumTimeIntervals] = useState(1);
  return (
    <TableRow
      key={dayName}
      sx={{ borderColor: 'white' }}
    >
      <TableCell sx={{ borderColor: 'white', padding: '8px'  }} component="th" scope="row">
        <h2 style={tutoring_styles.DayName}>
          {dayName}
        </h2>
      </TableCell>
      <TableCell sx={{ borderColor: 'white', padding: '8px' }} align="right">
        <div style={tutoring_styles.SwitchContainer}>
          <Switch checked={numTimeIntervals > 0} onChange={
            (event) => setNumTimeIntervals((old) => (old == 0 ? 1 : 0))
          } />
        </div>
      </TableCell>
      <TableCell sx={{ borderColor: 'white', padding: '8px'  }} align="right">
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
