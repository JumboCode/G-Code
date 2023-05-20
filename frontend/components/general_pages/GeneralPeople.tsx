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
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal'
import Cookies from 'js-cookie'

import Link from 'next/link'

// icons
import AddIcon from '@mui/icons-material/Add';

// backend
import { deleteUser, getUsers } from '../../api/routes';

const modal_style = {
  backgroundColor: "#fff",
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  border: "1px solid rgba(0, 0, 0, 0.23)",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function Person({ person, updatePeople }) {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = () => {
    deleteUser(person._id).then(() => {
      handleClose()
      updatePeople()
    })
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modal_style}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              Are you sure you want to delete {person.firstname} {person.lastname} ({person.email})
            </Grid>
            <Grid item xs={6}>
              <Button variant='secondary' onClick={handleClose} fullWidth>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant='primary' onClick={handleDelete} fullWidth>
                Yes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <TableRow sx={{ height: '60px' }}>
        <TableCell component="th" scope="row">
          <Avatar> {person.firstname[0]}{person.lastname[0]} </Avatar>
        </TableCell>
        <TableCell component="th" scope="row">
          <Link href={'/People/' + person._id}>
            <Typography
              sx={{
                fontSize: '16px',
                fontFamily: '__Inter_9c9965, __Inter_Fallback_9c9965',
                lineHeight: '19.36px',
                fontWeight: '500',
                color: '#6A5DF9',
              }}
            >
              {person.firstname} {person.lastname}
            </Typography>
          </Link>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography>
            {person.type}
          </Typography>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography>
            {person.email}
          </Typography>
        </TableCell>
        <TableCell component="th" scope="row">
          <Button onClick={handleOpen} variant="text">
            Delete
          </Button>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function GeneralPeople(props) {
  const user = props.user

  const [people, setPeople] = useState([]);

  useEffect(() => {getUsers(setPeople)}, []);

  const studentCards = (
    <>
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

              <TableCell></TableCell>
            </TableRow>
            {people.map(person => <Person key={person._id} person={person} updatePeople={() => {getUsers(setPeople)}} />)}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={9} xs={12}>
          <Box className="headerBox">
            <Grid container>
              <Grid xs={12} md={8}>
                <Typography variant="h1">
                  Spring 2023 Cohort
                </Typography>
              </Grid>
              { 
                user.type == 'admin' &&
                <Grid xs={12} md={4}>
                <Link href="./People/invite">
                  <Button sx={{ float: 'right' }} variant='primary'>
                    <AddIcon /> Invite Users
                  </Button>
                </Link>
              </Grid>
              }
              
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
