import React from "react";
import dashboardStyles from "../styles/Dashboard.module.css";
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
    <div className={dashboardStyles.tutoringSessionCard}>
      <div>
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
      </div>
      <div className={dashboardStyles.joinButton}> Join Now</div>
    </div>
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
