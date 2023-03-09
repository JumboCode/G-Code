import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../theme.ts'
import { DRAWER_WIDTH } from "../../constants";
import HeaderNav from '../../components/headernav';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid'
import axios from 'axios';

export default function InviteUser() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = (_) => {
        const valid = peopleToAdd.reduceRight((acc, person) => {return (acc && validate_person(person))}, true)
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
    const validate_string = (input: string) => {return input != ""}
    const validate_email = (input: string) => {return input.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)}
    const check_duplicates = (input: string, arr: Array<string>) => {return arr.map(item => item.toLowerCase()).filter((item, index) => arr.indexOf(item.toLowerCase()) != index).includes(input.toLowerCase())}
    const validate_person = person => {return (
        validate_string(person.firstname) && 
        validate_string(person.lastname) && 
        !check_duplicates(person.email, peopleToAdd.map(person => person.email)) && 
        validate_email(person.email))}

    return (
        <ThemeProvider theme={theme}>
            
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
