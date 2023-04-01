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
    axios.get('http://localhost:8000/api/students')
      .then(res => {
        console.log(res)
        setAssignments(res.data)
      })
  }, []);

  
  const AssignmentList = assignments.map((assignment) => {
    return (
      <div>
        <p>{assignment.name}</p>

      </div>
    )
  })


//   const studentCards = students.map((student) => {
//     return (
//       <div style={{"margin": '10px', 'padding': '5px', "backgroundColor": "gray"}} key={student.id}>
//         <p>{student.name}</p>
//         <p>First Name: {student.firstname}</p>
//         <p>Email: {student.email}</p>
//         <p>Bio: {student.bio}</p>
//       </div>
//     );
// });

  return (
    <Router>
      <div className={styles.container}>
        <Sidebar currentPageTitle="Assignments" />
        <div className={assignentStyles.grid}>
          <div className={assignentStyles.header1}>
            <p> ASSIGNMENT </p>
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
            <div className={assignentStyles.question}>Q and A Board</div>
          </div>

          <div></div>
        </div>
        <Routes>
          <Route path="/Assignment1" element={<Assignment />}></Route>
        </Routes>
      </div>
    </Router>
  );
}