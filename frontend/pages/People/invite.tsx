import React, { useState } from "react";
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import IsUserAuthorized from "../../components/authentification";
import Margin from "../../components/margin";
import { student_pages, admin_pages, validate_email } from '../../constants'
import { Typography } from "@mui/material";
import "@fontsource/inter";
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import TextField from "@mui/material/TextField"
import MenuItem from '@mui/material/MenuItem'
import { inviteUsers } from "../../api/routes";

export default function ProfileDetails() {
    const save_user = curr_user => {
        if (user == null) {
            setUser(curr_user)
        }
    }
    IsUserAuthorized(save_user)

    const defaultRow = {
        firstname: "",
        lastname: "",
        email: "",
        acctype: "student"
    }

    const [user, setUser] = useState(null)
    const [peopleToAdd, setPeopleToAdd] = React.useState([{ ...defaultRow }])
    const [peopleToAddValid, setPeopleToAddValid] = React.useState(true)

    const handleSubmit = () => {
        let valid = true
        for (const person in peopleToAdd) {
            if (!validate_person(peopleToAdd[person])) {
                valid = false
            }
        }
        if (valid) {
            inviteUsers(peopleToAdd)
                .then(() => {
                    setPeopleToAdd([{ ...defaultRow }])
                    setPeopleToAddValid(true)
                })
        } else {
            setPeopleToAddValid(false)
        }
    }

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
    const check_duplicates = (input: string, arr: Array<string>) => { return arr.map(item => item.toLowerCase()).filter((item, index) => arr.indexOf(item.toLowerCase()) != index).includes(input.toLowerCase()) }
    const validate_person = person => {
        return (
            !check_duplicates(person.email, peopleToAdd.map(person => person.email)) &&
            validate_email(person.email))
    }

    if (!user) {
        return "loading..."
    }

    return (
        <Margin
            user={user}
            availablePages={user.type == 'admin' ? admin_pages : student_pages}
            currentPageTitle={'People'}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} lg={10}>
                    <Typography variant="h1" sx={{ marginBottom: '20px' }}>
                        Invite Users
                    </Typography>
                    <Box
                        sx={{
                            width: '100%',
                            bgcolor: 'background.paper',
                            borderRadius: "10px",
                            boxShadow: 5,
                            p: 4,
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            {peopleToAdd.map((row, index) => {
                                return (
                                    <Grid container spacing={1.5} key={index}>
                                        <Grid item xs={5}>
                                            <TextField
                                                name="email"
                                                label="Email"
                                                type="email"
                                                value={row.email}
                                                onChange={buildHandleChange(index)}
                                                error={!peopleToAddValid && (!validate_email(row.email) || check_duplicates(row.email, peopleToAdd.map(personn => personn.email)))}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Select
                                                name="acctype"
                                                value={row.acctype}
                                                onChange={buildHandleChange(index)}
                                                fullWidth
                                            >
                                                <MenuItem key={0} value="student">
                                                    Student
                                                </MenuItem>
                                                <MenuItem key={1} value="admin">
                                                    Admin
                                                </MenuItem>
                                            </Select>
                                        </Grid>
                                        <Grid item xs={3}>
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
                                    <Button variant="secondary" fullWidth>
                                        Cancel
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="primary" onClick={handleSubmit} fullWidth>
                                        Invite Users
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Margin >
    )
}