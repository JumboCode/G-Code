import React from "react";

// mui imports
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// styles
import styles from '../../styles/Home.module.css'
import AssignmentList from "../assignmentsList";
import IndividualAssignment from "./IndividualAssignment";
import CreateAssignmentModal from "../createAssignmentModal";

import { getCurrentAssignments, getPreviousAssignments } from '../../api/routes'

export default function AdminAssignments({ user, assignment_id }) {
    const [currentAssignments, setCurrentAssignments] = React.useState([])
    const [previousAssignments, setPreviousAssignments] = React.useState([])
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        getCurrentAssignments(setCurrentAssignments)
        getPreviousAssignments(setPreviousAssignments)
    }, [])

    if (assignment_id) {
        return <IndividualAssignment user={user} assignment_id={assignment_id} />
    }
    const handleOpen = () => { setOpen(true) }
    const handleClose = () => { setOpen(false) }

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
