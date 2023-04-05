import React, {useEffect, useState} from "react";
import axios from 'axios';
import Sidebar from "../components/sidebar";
import styles from "../styles/Home.module.css";
import assignentStyles from "../styles/Assignments.module.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Assignment from "./Assignments";

export default function Assignments() {
  
  const [assignments, setAssignments] = useState([{}])

  useEffect(() => {
    axios.get('http://localhost:8000/api/get_student_assignments', 
              {params: { studentid: "invalid" }
    }) .then(res => {
        console.log(res)
        console.log(res.data)
        setAssignments(res.data)
      })
  }, []);

  
  const AssignmentList = assignments.map((assignment) => {
    return (
      <div key={assignment.name}> 
        <p> TEST </p>      
        <p>{assignment.description}</p>
      </div>s
    )
  })

  // return (
  //   <div>
  //     <p> TEST </p>
  //     {AssignmentList}
  //   </div>
  // )

  return (
    // <Router>
      <div className={styles.container}>
        <Sidebar currentPageTitle="Assignments" />
        <div className={assignentStyles.grid}>
          <div className={assignentStyles.header1}>
            <p> ASSIGNMENT </p>
          </div>

          {AssignmentList}
          {/* <div className={assignentStyles.leftColumn}>
            <div className={assignentStyles.leftCard}>
              <Link to="Assignment1">Assignment 1</Link>
            </div>
            <div className={assignentStyles.leftCard}>Assignment 2</div>
            <div className={assignentStyles.leftCard}>Assignment 3</div>
          </div> */}

          <div className={assignentStyles.rightColumn}>
            <div className={assignentStyles.header2}> Questions? </div>

            <div className={assignentStyles.question}>
              Schedule an Appointment
            </div>
            <div className={assignentStyles.question}>Q and A Board</div>
          </div>

          <div></div>
        </div>
        {/* <Routes>
          <Route path="/Assignment1" element={<Assignment />}></Route>
        </Routes> */}
      </div>
    // </Router>
  );
}