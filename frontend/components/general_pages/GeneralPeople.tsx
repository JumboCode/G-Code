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

// icons
import AddIcon from '@mui/icons-material/Add';

// components
import HeaderNav from '../headernav';

// backend
import axios from "axios";

// constants
import { DRAWER_WIDTH } from '../../constants';
import { theme } from '../../theme'

export default function GeneralPeople(props) {
  const user = props.user

  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (_) => {
    const valid = peopleToAdd.reduceRight((acc, person) => { return (acc && validate_person(person)) }, true)
    if (valid) {
      axios.put('http://localhost:8000/api/request_users/', peopleToAdd)
      setPeopleToAdd([{ ...defaultRow }])
      setPeopleToAddValid(true)
      handleClose()
    } else {
      setPeopleToAddValid(false)
    }
  }

  const defaultRow = {
    firstname: "",
    lastname: "",
    email: "",
    acctype: "Student"
  }

  const [peopleToAdd, setPeopleToAdd] = React.useState([{ ...defaultRow }])
  const [peopleToAddValid, setPeopleToAddValid] = React.useState(true)
  const buildHandleChange = (index: number) => {
    return (
      (event) => {
        setPeopleToAdd(
          peopleToAdd.map(
            (person, person_index) => {
              return (
                {
                  ...person,
                  [event.target.name]: index == person_index ? event.target.value : person[event.target.name]
                })
            }))
      })
  }

  // validation
  const validate_string = (input: string) => { return input != "" }
  const validate_email = (input: string) => { return input.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) }
  const check_duplicates = (input: string, arr: Array<string>) => { return arr.map(item => item.toLowerCase()).filter((item, index) => arr.indexOf(item.toLowerCase()) != index).includes(input.toLowerCase()) }
  const validate_person = person => {
    return (
      validate_string(person.firstname) &&
      validate_string(person.lastname) &&
      !check_duplicates(person.email, peopleToAdd.map(person => person.email)) &&
      validate_email(person.email))
  }

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
          <TableRow sx={{ backgroundColor: 'inherit' }}>
            <TableCell></TableCell>
            <TableCell sx={{ backgroundColor: 'inherit' }}>
              <Typography variant='h4' sx={{ fontSize: '16px' }}>
                Name
              </Typography>
            </TableCell>
            <TableCell align='left'>
              <Typography variant='h4' sx={{ fontSize: '16px' }}>
                Email
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
                    {student.email}
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
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1000,
          bgcolor: 'background.paper',
          border: '1px solid rgba(0, 0, 0, 0.23)',
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {peopleToAdd.map((row, index) => {
              return (
                <Grid container spacing={1.5} key={index}>
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <p>
                        Student {index + 1}
                      </p>
                    </Box>

                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      name="firstname"
                      label="First Name"
                      type="text"
                      value={row.firstname}
                      onChange={buildHandleChange(index)}
                      error={!peopleToAddValid && !validate_string(row.firstname)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      name="lastname"
                      label="Last Name"
                      type="text"
                      value={row.lastname}
                      onChange={buildHandleChange(index)}
                      error={!peopleToAddValid && !validate_string(row.lastname)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl fullWidth>
                      <TextField
                        name="email"
                        label="Email"
                        type="email"
                        value={row.email}
                        onChange={buildHandleChange(index)}
                        error={!peopleToAddValid && (!validate_email(row.email) || check_duplicates(row.email, peopleToAdd.map(personn => personn.email)))}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl fullWidth>
                      <Select
                        name="acctype"
                        value={row.acctype}
                        onChange={buildHandleChange(index)}
                      >
                        <MenuItem key={0} value="Student">
                          Student
                        </MenuItem>
                        <MenuItem key={1} value="Tutor">
                          Tutor
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center"
                      }}
                    >
                      <Button
                        variant="primary"
                        sx={{
                          minWidth: 0,
                        }}
                        onClick={() => {
                          setPeopleToAdd([...peopleToAdd, { ...defaultRow }])
                        }}
                      >
                        +
                      </Button>
                      <Button
                        disabled={peopleToAdd.length == 1}
                        variant="secondary"
                        sx={{
                          minWidth: 0,
                        }}
                        onClick={() =>
                          setPeopleToAdd(peopleToAdd.filter((_, el_idx) => { return el_idx != index }))
                        }
                      >
                        -
                      </Button>
                    </Box>
                  </Grid>
                </Grid>)
            })}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Button variant="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Button variant="primary" onClick={handleSubmit}>
                    Invite Users
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
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
                <Button sx={{ float: 'right' }} variant='primary' onClick={handleOpen}>
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
    </>
  );
}
