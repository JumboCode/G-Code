import React from "react";
import Sidebar from "../components/sidebar";
import styles from "../styles/Home.module.css";
import assignentStyles from "../styles/Assignments.module.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function Assignments() {
  return (
    <div className={styles.container}>
      <Sidebar currentPageTitle="Assignments" />
      <div className={assignentStyles.grid}>
        <div className={assignentStyles.header1}>
          <p> ASSIGNMENTS </p>
        </div>

        <div className={assignentStyles.leftColumn}>
          <div className={assignentStyles.leftCard}>Assignment 1</div>
          <div className={assignentStyles.leftCard}>Assignment 2</div>
          <div className={assignentStyles.leftCard}>Assignment 3</div>
        </div>

        <div className={assignentStyles.rightColumn}>
          <div className={assignentStyles.header2}> Questions? </div>

          <div className={assignentStyles.question}>
            Schedule an Appointment
          </div>
          <div className={assignentStyles.question}>Q and A Board</div>
        </div>

        <div></div>
      </div>
    </div>
  );
}
