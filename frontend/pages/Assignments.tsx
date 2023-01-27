import React from "react";
import { Grid, Box, CssBaseline} from "@mui/material";
import HeaderNav from '../components/headernav.tsx';

const drawerWidth = 240;

export default function Assignments() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <HeaderNav currentPageTitle="Assignments" />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <div style={AssignmentStyle.AssignmentPage}>
          <div style={AssignmentStyle.AssignmentList}>
            <AssignmentHeading />
            <Assignment assignmentNum={1} dueDateText="12/4/22" />
            <Assignment assignmentNum={2} dueDateText="12/4/22" />
            <Assignment assignmentNum={3} dueDateText="12/4/22" />
            <CompletedHeading />
          </div>
          <div style={AssignmentStyle.QuestionActionList}>
            <Questions />
          </div>
        </div>
      </Box>
    </Box>

  )
}

function AssignmentHeading() {
  return <div style={AssignmentStyle.AssignmentHeading}>
    <h1>ASSIGNMENTS</h1>
  </div>
}

function CompletedHeading() {
  return <div style={AssignmentStyle.CompletedHeading}>
    <h1>COMPLETED</h1>
  </div>
}

function Questions() {
  return <div>
    <h2>Questions?</h2>
    <QuestionActions
      text="Schedule an Appointment"
      imageLink="./ScheduleAppointment.svg"
    />
    <QuestionActions
      text="Q and A Board"
      imageLink="./QandABoard.svg"
    />
  </div>
}

function QuestionActions({ text, imageLink }) {
  return <div style={AssignmentStyle.QuestionActionBox}>
    <picture>
      <img src={imageLink} alt="" />
    </picture>
    <h3>{text}</h3>
  </div>
}

function Assignment({ assignmentNum, dueDateText }) {
  return <div style={AssignmentStyle.Assignment}>
    Assignment {assignmentNum} {dueDateText}
  </div>
}

function Completed() {

}

let AssignmentStyle = ({
  AssignmentPage:
  {
    paddingTop: '75px',
    display: 'flex'
  },
  AssignmentList:
  {
    // backgroundColor: 'red',
    width: '55vw',
    marginLeft: '3vw',
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },
  QuestionActionList:
  {
    width: '20vw',
    marginLeft: '10vw',
    // backgroundColor: 'yellow',

  },
  QuestionActionBox: {
    backgroundColor: '#715CFA',
    //height: '12vh',
    width: '12vw',
    borderRadius: '27.17',
  },
  Assignment: {
    border: '1px solid #E0E0E0',
    borderRadius: '25px',
    padding: '15px',
    color: '#4A4A4A',
    fontFamily: 'Poppins',
    fontWeight: 700
  },
  AssignmentHeading: {
    fontFamily: 'Poppins',
    color: '#2C3A57'
  },
  CompletedHeading: {
    fontFamily: 'Poppins',
    color: '#00777F'
  }
})