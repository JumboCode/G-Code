import React from "react";

// optimized mui imports
import Grid from "@mui/material/Grid"

// styles
import assignentStyles from "../../styles/Assignments.module.css";

export default function StudentAssignments(props) {
  const user = props.user

  return (
    <Grid container>
      <Grid item xs={12}>
        <div className={assignentStyles.header1}>
          <p> Assignments </p>
        </div>
      </Grid>
      <Grid item xs={12} md={9}>
        <div className={assignentStyles.leftColumn}>
          <div className={assignentStyles.leftCard}>
            Assignment 1
          </div>
          <div className={assignentStyles.leftCard}>Assignment 2</div>
          <div className={assignentStyles.leftCard}>Assignment 3</div>
        </div>
      </Grid>
      <Grid item xs={12} md={3}>
        <div className={assignentStyles.header2}> Questions? </div>
        <div className={assignentStyles.question}>
          Schedule an Appointment
        </div>
        <div className={assignentStyles.question}>Q and A Board</div>
      </Grid>
    </Grid>
  );
}