import React from "react";
import dashboardStyles from "../styles/Dashboard.module.css";
import { Grid, Button } from '@mui/material'
import { CalendarToday, AccessTime } from "@mui/icons-material";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";


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

export default function TutoringCardDisplay() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/appointments3", {
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        setSessions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      {sessions.length > 0 ? (
        sessions.map((session) => {
          const startTime = new Date(session.startTime);
          const endTime = new Date(session.endTime);
          const date = new Date(session.date);

          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = date.toLocaleDateString('en-US', options);

          return (
            <TutoringCard
              name={session.name}
              date={formattedDate}
              time={`${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`}
            />
          );
        })
      ) : (
        "No upcoming tutoring sessions"
      )}
    </div>
  );
}