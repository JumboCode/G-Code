import React from "react";
import dashboardStyles from "../styles/Dashboard.module.css";

export default function TutoringCard({ sessions }) {
  return <div>{sessions ? sessions : "No upcoming tutoring sessions"}</div>;
}
