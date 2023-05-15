import React, { useState, useEffect } from 'react';

// optimized mui imports
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from '@mui/material/styles';
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import Avatar from "@mui/material/Avatar"
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

import Link from 'next/link'

// icons
import AddIcon from '@mui/icons-material/Add';

// components
import HeaderNav from '../headernav';

// backend
import axios from "axios";

// constants
import { DRAWER_WIDTH } from '../../constants';
import { theme } from '../../theme'


function QuestionList({ questions }) {
  return (
    <div>
      {questions.map(question => (
        <div key={question.title}>
          <h2>{question.title}</h2>
          <Link href={`/question/${question.title}`}>
            <a>See details</a>
          </Link>
        </div>
      ))}
    </div>
  )
}


export default function GeneralPeople(props) {
  const user = props.user

  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8000/api/users');
        const invite_response = await axios.get('http://localhost:8000/api/studentinvites');
        let student_list = response.data

        const invite_dict = {}
        invite_response.data.forEach((invite) => {
          const dictKey = invite["email"]
          invite_dict[dictKey] = invite
        })

        // sorted so students with pending invites appear first
        let sorted_students = []
        student_list.forEach((student) => {
          if (student["email"] in invite_dict) {
            student["invite_status"] = "Pending"
            sorted_students.unshift(student)
          } else {
            student["invite_status"] = "Accepted"
            sorted_students.push(student)
          }
        })
        setStudents(sorted_students);
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
          <TableRow sx={{ backgroundColor: 'inherit' }}>
            <TableCell></TableCell>
            <TableCell sx={{ backgroundColor: 'inherit' }}>
              <Typography variant='h4' sx={{ fontSize: '16px' }}>
                Name
              </Typography>
            </TableCell>
            <TableCell align='left'>
              <Typography variant='h4' sx={{ fontSize: '16px' }}>
                Type
              </Typography>
            </TableCell>
            <TableCell align='left'>
              <Typography variant='h4' sx={{ fontSize: '16px' }}>
                Email
              </Typography>
            </TableCell>
            <TableCell align='left'>
              <Typography variant='h4' sx={{ fontSize: '16px' }}>
                Invite Status
              </Typography>
            </TableCell>

            <TableCell></TableCell>
          </TableRow>
          {students.map(student => {
            return (
              <TableRow sx={{ height: '60px' }}>
                <TableCell component="th" scope="row">
                  <Avatar> {student.firstname[0]}{student.lastname[0]} </Avatar>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontFamily: '__Inter_9c9965, __Inter_Fallback_9c9965',
                      lineHeight: '19.36px',
                      fontWeight: '500',
                      color: '#6A5DF9',
                    }}
                  >
                    {student.firstname} {student.lastname}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Typography>
                    {student.type}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Typography>
                    {student.email}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Typography>
                    {student.invite_status == "Pending" ? "Pending" : ""}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Button variant="text">
                    ...
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (!user) {
    return <p>Loading...</p>
  }
  
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={9} xs={12}>
          <Box sx={{ padding: "40px 0 30px 0" }}>
            <Grid container>
              <Grid xs={12} md={8}>
                <Typography variant="h1">
                  Spring 2023 Cohort
                </Typography>
              </Grid>
              <Grid xs={12} md={4}>
                <Link href="./People/invite">
                  <Button sx={{ float: 'right' }} variant='primary'>
                    <AddIcon /> Invite Users
                  </Button>
                </Link>
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
    </>
  );
}
