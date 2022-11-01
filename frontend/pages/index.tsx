import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";
import axios from "axios";
import React from "react";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={dashboardStyles.header1}>
        <p> Welcome, Ariya </p>
      </div>
      <div className={dashboardStyles.grid}>
        <div className={dashboardStyles.assignmentCard}>Assignment</div>
        <div className={dashboardStyles.upcomingMeetingCard}>
          Upcoming Meeting
        </div>
        <div className={dashboardStyles.assignmentCard}>Common Questions</div>
        <div className={dashboardStyles.upcomingMeetingCard}>Events</div>
        <div className={styles.card}></div>
      </div>
    </div>
  );
}
