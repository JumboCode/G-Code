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

export default function AdminAssignments(props) {
    const [currentAssignments, setCurrentAssignments] = React.useState([])
    const [previousAssignments, setPreviousAssignments] = React.useState([])
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


    const user = props.user
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={8}>
                <Typography variant='h1'> Assignments </Typography>
                <Typography variant='subtitle1'> View and edit assignments </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
                <Typography variant='h3'> Current Assignments </Typography>
                {currentAssignments.length ? <AssignmentList assignmentList={currentAssignments} /> : 'No current assignments'}
            </Grid>
            <Grid item xs={12} lg={8}>
                <Typography variant='h3'> Previous Assignments </Typography>
                {previousAssignments.length ? <AssignmentList assignmentList={previousAssignments} /> : 'No previous assignments'}
            </Grid>
            <Grid item xs={12} lg={8}>
                <Button variant='primary'> Create New Assignment </Button>
            </Grid>
        </Grid>
    )
}
