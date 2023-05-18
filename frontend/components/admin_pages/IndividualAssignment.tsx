import axios from "axios"
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"
const ReactQuill = dynamic(import('react-quill'), { ssr: false });
import { useRouter } from "next/router";
import IsUserAuthorized from "../../components/authentification";
import Margin from "../../components/margin";
import { student_pages, admin_pages } from '../../constants'
import { TextField, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";
import "@fontsource/inter";
import Cookies from 'js-cookie'
import Box from '@mui/material/Box'
import { Assignment } from "@mui/icons-material";
import { dateToString, formatAMPM } from "../../constants";
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import BackButton from "../../components/backButton";
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Card from '@mui/material/Card'
import CreateAssignmentModal from "../createAssignmentModal";


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



export default function IndividualAssignment({ user, assignment_id }) {

    const [assignment, setAssignment] = useState(null);
    const [students, setStudents] = useState([]);
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const getAssignment = () => {
        const apiUrl = 'http://localhost:8000/api/assignment_by_id'
        const token = Cookies.get('gcode-session')
        const headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + token,
        };
        axios.get(`${apiUrl}?assignment_id=${assignment_id}`, { headers })
            .then(response => {
                setAssignment(response.data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const getStudents = () => {
        axios.get('http://localhost:8000/api/students')
            .then(response => setStudents(response.data))
    }

    useEffect(() => {
        getAssignment()
        getStudents()
    }, [assignment_id])

    if (!user || !assignment || !students) {
        return <>Loading...</>
    }

    const IndividualAssignmentRow = ({ individual_assignment }) => {
        let student = {firstname: 'student not found', lastname: ''}
        for (const idx in students) {
            if (students[idx]._id == individual_assignment.studentid) {
                student = students[idx]
            }
        }
        return (
            <TableRow>
                <TableCell sx={{ backgroundColor: 'inherit' }}>
                    <Typography variant='h4' sx={{ fontSize: '16px' }}>
                        {student.firstname + ' ' + student.lastname}
                    </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: 'inherit' }}>
                    <Typography variant='h4' sx={{ fontSize: '16px' }}>
                        {individual_assignment.submitted ? 'Yes' : 'No'}
                    </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: 'inherit' }}>
                    <Typography variant='h4' sx={{ fontSize: '16px' }}>
                        <a target="_blank" href={'http://' + individual_assignment.submissionLink}> {individual_assignment.submissionLink} </a>
                    </Typography>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={10}>
                    <BackButton href="/Assignments" />
                </Grid>
                <Grid item xs={12} lg={10}>
                    <Typography variant="h1"> {assignment.name} </Typography>
                    <Typography variant="subtitle1"> {"Due " + dateToString(new Date(assignment.dueDate)) + " at " + formatAMPM(assignment.dueDate)} </Typography>
                </Grid>

                <Grid item xs={12} lg={10}>
                    <Typography variant="h3" sx={{ marginBottom: '10px' }}> Assignment Description </Typography>
                    <Box
                        sx={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            border: '1.76918px solid #E0E0E0'
                        }}
                    >
                        {assignment.description}
                    </Box>
                </Grid>
                <Grid item xs={12} lg={10}>
                    <Typography variant="h3"> Students </Typography>
                    <Card>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableBody>
                                    <TableRow sx={{ backgroundColor: 'inherit' }}>
                                        <TableCell sx={{ backgroundColor: 'inherit' }}>
                                            <Typography variant='h4' sx={{ fontSize: '16px' }}>
                                                Name
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='left'>
                                            <Typography variant='h4' sx={{ fontSize: '16px' }}>
                                                Submitted
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='left'>
                                            <Typography variant='h4' sx={{ fontSize: '16px' }}>
                                                Submission Link
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    {assignment.individual_assignments.map(individual_assignment => 
                                        <IndividualAssignmentRow individual_assignment={individual_assignment} />
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>


                </Grid>
            </Grid>
        </>
    )
}