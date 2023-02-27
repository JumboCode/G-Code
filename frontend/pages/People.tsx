import React, { useState, useEffect } from 'react';
import { Grid, Box, CssBaseline, Paper } from "@mui/material";
import HeaderNav from '../components/headernav.tsx';
import styles from "../styles/Home.module.css";
import axios from "axios";
import { DRAWER_WIDTH } from '../constants';
import { ThemeProvider, Typography, Button, Card, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { theme } from '../theme.ts'
import AddIcon from '@mui/icons-material/Add';

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

  const studentCards = (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {students.map(student => {
            return (
              <TableRow>
                <TableCell sx={{ borderColor: 'white', padding: '2px' }} component="th" scope="row">
                  <Typography>
                    {student.firstname} {student.lastname}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderColor: 'white', padding: '2px' }} component="th" scope="row">
                  <Typography>
                    {student.email}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderColor: 'white', padding: '2px' }} component="th" scope="row">
                  <Button variant="primary">
                    See info
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <HeaderNav currentPageTitle="People" />

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
        >
          <Grid sx={{ paddingTop: '50px' }} container spacing={2}>
            <Grid item md={9} xs={12}>
              <Box sx={{ padding: "40px 0 30px 0" }}>
                <Grid container>
                  <Grid xs={12} md={8}>
                    <Typography variant="h1">
                      Spring 2023 Cohort
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={4}>
                    <Button sx={{ float: 'right' }} variant='primary'>
                      <AddIcon /> Invite Users
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Card>
                {studentCards}
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>

  );
}
