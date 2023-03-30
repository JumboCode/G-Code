import React from "react";
import Sidebar from "../components/sidebar";
import styles from "../styles/Home.module.css";
import assignentStyles from "../styles/Assignments.module.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Assignment from "./Assignment";

export default function Assignments() {
  return (
    <Router>
      <div className={styles.container}>
        <Sidebar currentPageTitle="Assignments" />
        <div className={assignentStyles.grid}>
          <div className={assignentStyles.header1}>
            <p> ASSIGNMENTS </p>
          </div>

          <div className={assignentStyles.leftColumn}>
            <div className={assignentStyles.leftCard}>
              <Link to="Assignment1">Assignment 1</Link>
            </div>
            <div className={assignentStyles.leftCard}>Assignment 2</div>
            <div className={assignentStyles.leftCard}>Assignment 3</div>
          </div>

          <div className={assignentStyles.rightColumn}>
            <div className={assignentStyles.header2}> Questions? </div>

            <div className={assignentStyles.question}>
              Schedule an Appointment
            </div>
            <div className={assignentStyles.question}><Link to="FAQBoard">Q and A Board</Link></div>
          </div>

          <div></div>
        </div>
        <Routes>
          <Route path="/Assignment1" element={<Assignment />}></Route>
          <Route path="/FAQBoard"></Route>
        </Routes>
      </div>
    </Router>
  );
}