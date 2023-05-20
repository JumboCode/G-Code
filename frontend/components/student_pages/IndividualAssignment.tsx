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

import { getAssignment, submitAssignment } from "../../api/routes";

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
    const [open, setOpen] = useState(false)
    const [gitHub, setGitHub] = useState("")
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    

    useEffect(() => {
        getAssignment(assignment_id, setAssignment)
    }, [assignment_id])

    if (!user || !assignment) {
        return <>Loading...</>
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
                            <TextField
                                fullWidth
                                name="github_link"
                                id="outlined-basic"
                                label="GitHub link"
                                variant="outlined"
                                value={gitHub}
                                onChange={e => setGitHub(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant='secondary' onClick={handleClose} fullWidth>
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant='primary' onClick={() => submitAssignment(assignment_id, gitHub)} fullWidth>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={10}>
                    <BackButton href="/Assignments" />
                </Grid>
                <Grid item xs={12} lg={10}>
                    <Typography variant="h1"> {assignment.name} </Typography>
                    <Typography variant="subtitle1"> {"Due " + dateToString(new Date(assignment.dueDate)) + " at " + formatAMPM(assignment.dueDate)} </Typography>
                </Grid>
                <Grid item xs={12} lg={10}>
                    <Stack direction="row" spacing={1}>
                        {assignment['individual_assignment']['submitted'] && <Chip label="Submitted" color="success" />}
                        {!assignment['individual_assignment']['submitted'] && <Chip label="Not Submitted" color="error" />}
                    </Stack>
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
                    <Button variant="primary" onClick={handleOpen}> {assignment['individual_assignment']['submitted'] ? 'Resubmit' : 'Submit'} </Button>
                </Grid>
            </Grid>
        </>
    )
}