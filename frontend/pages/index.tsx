import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";
import axios from "axios";
import React from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import Footer from "../components/footer";

export default function Home() {
  return (
    <div className={styles.container}>
      <Sidebar currentPageTitle={"HOME"}/>
      <div className={dashboardStyles.header1}>
        <p> Welcome, Ariya </p>
      </div>
      <div className={dashboardStyles.grid}>
        <div className={dashboardStyles.assignmentCard}>
          <div className={dashboardStyles.cardTitle}> Assignments</div>
          <div className={dashboardStyles.upperRightCornerText}> SEE ALL</div>
          <div className={dashboardStyles.assignment}>
            Paired Programming Project Pt. 2
            <div className={dashboardStyles.dueDate}>
              Wed, October 7, 9:59 PM
            </div>
            <div className={dashboardStyles.arrowIcon}> </div>
          </div>
          <div className={dashboardStyles.assignment}>
            Week 6 Module of Codecademy
            <div className={dashboardStyles.dueDate}>
              Wed, October 7, 9:59 PM
            </div>
            <div className={dashboardStyles.arrowIcon}> </div>
          </div>
          <div className={dashboardStyles.assignment}>
            Week 6 Slides and Recording
            <div className={dashboardStyles.arrowIcon}> </div>
          </div>
          <div className={dashboardStyles.assignment}>
            All About Github
            <div className={dashboardStyles.arrowIcon}> </div>
          </div>
        </div>
        <div className={dashboardStyles.upcomingMeetingCard}>
          Upcoming Meeting
          <div className={dashboardStyles.upperRightCornerText}>+ Add More</div>
          <div className={dashboardStyles.buttonContainer}>
            <button className={dashboardStyles.joinButton}> Join </button>{" "}
            <button className={dashboardStyles.rescheduleButton}>
              {" "}
              Reschedule{" "}
            </button>
          </div>
        </div>
        <div className={dashboardStyles.commonQuestionsCard}>
          Common Questions
        </div>
        <div className={dashboardStyles.eventsCard}>
          Eventsx
          <div className={dashboardStyles.upperRightCornerText}> SEE ALL</div>
        </div>
        <div className={dashboardStyles.yourGoalsCard}>
          Your Goals
          <div className={dashboardStyles.upperRightCornerText}> EDIT </div>
        </div>
      </div>
    </div>
  );
}
