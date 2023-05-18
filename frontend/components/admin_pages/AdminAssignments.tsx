import React from "react";

// mui imports
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import HeaderNav from '../headernav';
import { ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Cookie from 'js-cookie'


// constants
import { DRAWER_WIDTH } from "../../constants";
import { theme } from '../../theme'

// styles
import styles from '../../styles/Home.module.css'
import AssignmentList from "../assignmentsList";
import axios from "axios";
import IndividualAssignment from "./IndividualAssignment";
import CreateAssignmentModal from "../createAssignmentModal";

export default function AdminAssignments({ user, assignment_id }) {
    if (assignment_id) {
        return <IndividualAssignment user={user} assignment_id={assignment_id} />
    }
    const [currentAssignments, setCurrentAssignments] = React.useState([])
    const [previousAssignments, setPreviousAssignments] = React.useState([])
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => { setOpen(true) }
    const handleClose = () => { setOpen(false) }

    const token = Cookie.get('gcode-session')
    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    }

    const getCurrentAssignments = () => {
        axios.get("http://localhost:8000/api/current_assignments", { headers })
            .then(response => setCurrentAssignments(response.data))
            .catch(error => console.log(error))
    }
    const getPreviousAssignments = () => {
        axios.get("http://localhost:8000/api/past_assignments", { headers })
            .then(response => setPreviousAssignments(response.data))
            .catch(error => console.log(error))
    }
    React.useEffect(() => {
        getCurrentAssignments()
        getPreviousAssignments()
    }, [])


    return (
        <Grid container spacing={2}>
            <CreateAssignmentModal open={open} handleClose={handleClose} />
            <Grid item xs={12} lg={8}>
                <Box className="headerBox">
                    <Typography variant='h1'> Assignments </Typography>
                    <Typography variant='subtitle1'> View and edit assignments </Typography>
                </Box>
                <Typography variant='h3'> Current Assignments </Typography>
                {currentAssignments.length ? <AssignmentList assignmentList={currentAssignments} /> : 'No current assignments'}
            </Grid>
            <Grid item xs={12} lg={8}>
                <Typography variant='h3'> Previous Assignments </Typography>
                {previousAssignments.length ? <AssignmentList assignmentList={previousAssignments} /> : 'No previous assignments'}
            </Grid>
            <Grid item xs={12} lg={8}>
                <Button variant='primary' onClick={handleOpen}> Create New Assignment </Button>
            </Grid>
        </Grid>
    )
}
