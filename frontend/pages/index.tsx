import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";
import axios from "axios";
import React from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import Footer from "../components/footer";
import TutoringCard from "../components/tutoringCard";

export default function Home() {
  return (
    <div className={styles.container}>
      <Sidebar currentPageTitle={"HOME"} />
      <div className={dashboardStyles.grid}>
        <div className={dashboardStyles.header1}>
          <p> Welcome, Ariya </p>
        </div>
        <div className={dashboardStyles.leftColumn}>
          <div className={dashboardStyles.header2}>Coming Up Soon</div>
          <div className={dashboardStyles.leftCard}>
            <div className={dashboardStyles.cardTitle}>
              Tutoring Session
              <TutoringCard sessions={2} />
            </div>
          </div>
          <div className={dashboardStyles.leftCard}>
            <div className={dashboardStyles.cardTitle}>Assignments</div>
          </div>
          <div className={dashboardStyles.leftCard}>
            <div className={dashboardStyles.cardTitle}>Work Together</div>
          </div>
          <div className={dashboardStyles.leftCard}>
            <div className={dashboardStyles.cardTitle}>Events</div>
          </div>
        </div>

        <div className={dashboardStyles.rightColumn}>
          <div className={dashboardStyles.header2}> Ask Somebody </div>

          <div className={dashboardStyles.question}>Programming Help</div>
          <div className={dashboardStyles.question}>Career Development</div>

          <div className={dashboardStyles.header2}>Anonymous FAQs</div>
          <div className={dashboardStyles.rightCard}>
            Trending Questions Board
            <div className={dashboardStyles.arrowIcon}>{">"}</div>
          </div>

          <div className={dashboardStyles.header2}>Community Resources</div>
          <div className={dashboardStyles.rightCard}>
            Commonly Asked Questions
            <div className={dashboardStyles.arrowIcon}>{">"}</div>
          </div>
          <div className={dashboardStyles.rightCard}>
            Helpful Links for HW
            <div className={dashboardStyles.arrowIcon}>{">"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
