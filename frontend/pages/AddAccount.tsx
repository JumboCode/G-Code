import React, { useState } from 'react';
import Sidebar from '../components/sidebar'
import styles from '../styles/Home.module.css'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ThemeProvider, Typography } from '@mui/material';
import { theme } from '../theme.ts'
import { DRAWER_WIDTH } from "../constants";
import HeaderNav from '../components/headernav';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid'
import axios from 'axios';

export default function Resources() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = (event) => {
        event.preventDefault()
        axios.put('http://localhost:8000/api/request_users/', peopleToAdd)
        setPeopleToAdd([{ ...defaultRow }])
        handleClose()
    }

    const defaultRow = {
        firstname: "",
        lastname: "",
        email: "",
        acctype: "Student"
    }

    const [peopleToAdd, setPeopleToAdd] = React.useState([{ ...defaultRow }])
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

    return (
        <ThemeProvider theme={theme}>
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
                    border: '2px solid #000',
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
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            name="lastname"
                                            label="Last Name"
                                            type="text"
                                            value={row.lastname}
                                            onChange={buildHandleChange(index)}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormControl fullWidth>
                                            <TextField
                                                name="email"
                                                label="Email"
                                                type="text"
                                                value={row.email}
                                                onChange={buildHandleChange(index)}
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
                                    <Button variant="secondary">
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
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <HeaderNav currentPageTitle="People" />
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
                >
                    <Box paddingTop="50px">
                        <Button variant="primary" onClick={handleOpen}>Invite Users</Button>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

function TextInput({ name, label, val, handleInput }) {
    return <TextField
        name={name}
        label={label}
        type="text"
        value={val}
        onChange={handleInput}
    />
}
