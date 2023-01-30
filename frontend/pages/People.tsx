import React, { useState, useEffect } from 'react';
import { Grid, Box, CssBaseline } from "@mui/material";
import HeaderNav from '../components/headernav.tsx';
import dashboardStyles from "../styles/Dashboard.module.css";
import axios from "axios";
import { DRAWER_WIDTH } from '../constants';

export default function People() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8000/api/students');
        console.log(response)
        setStudents(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const studentCards = students.map((student) => {
    return (
      <div style={{"margin": '10px', 'padding': '5px', "backgroundColor": "gray"}} key={student.id}>
        <p>{student.name}</p>
        <p>First Name: {student.firstname}</p>
        <p>Email: {student.email}</p>
        <p>Bio: {student.bio}</p>
      </div>
    );
});

return (
  <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <HeaderNav currentPageTitle="People" />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
      >
        <Grid container spacing={2}>
          <Grid className={dashboardStyles.header1} item xs={12}>
            <p> Students </p>
          </Grid>
          <Grid item sm={12} md={12}>
            {studentCards}
          </Grid>
        </Grid>
      </Box>
    </Box>
  </>

);
}
