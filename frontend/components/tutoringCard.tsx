import React from "react";
import dashboardStyles from "../styles/Dashboard.module.css";
import { Grid, Button } from '@mui/material'
import { CalendarToday, AccessTime } from "@mui/icons-material";
import Image from "next/image";


function TutoringCard({
  name,
  date,
  time,
}: {
  name: string;
  date: string;
  time: string;
}) {
  return (
    <>
      <Grid container spacing={2} className={dashboardStyles.tutoringSessionCard}>
        <Grid item lg={8} md={12}>
          <div className={dashboardStyles.tutoringSessionImage}>
            <Image
              src="/sharkMeldon.png"
              alt="Shark Meldon Incarnate"
              width={75}
              height={75}
              style={{ borderRadius: "100pc", overflow: "hidden" }}
            />
          </div>

          <div className={dashboardStyles.tutoringSessionTextDetails}>
            <div className={dashboardStyles.tutoringSessionName}>{name}</div>

            <div className={dashboardStyles.tutoringSessionLogistics}>
              <CalendarToday />
              <div className={dashboardStyles.tutoringSessionDate}>{date}</div>
              <AccessTime />
              <div className={dashboardStyles.tutoringSessionTime}>{time}</div>
            </div>
          </div>
        </Grid>
        <Grid item lg={4} md={12}>
          <div style={{float: "right"}}>
            <Button variant="primary" sx={{margin: "0 5px 0 5px"}}> Join </Button>
            <Button variant="text" sx={{margin: "0 5px 0 5ipx"}}> Manage </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default function TutoringCardDisplay({ sessions }) {
  return (
    <div>
      {sessions
        ? TutoringCard({
          name: "Shark Meldon",
          date: "Mon Oct 10",
          time: "1:30 - 2:00 PM",
        })
        : "No upcoming tutoring sessions"}
    </div>
  );
}
