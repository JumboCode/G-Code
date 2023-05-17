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
import { Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";
import "@fontsource/inter";
import Cookies from 'js-cookie'

export default function ProfileDetails() {
    const router = useRouter()
    const { assignment_id } = router.query

    const [user, setUser] = useState(null)
    const [assignment, setAssignment] = useState(null);

    const save_user = curr_user => {
        if (user == null) {
            setUser(curr_user)
        }
    }
    IsUserAuthorized(save_user)

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

    useEffect(() => {
        getAssignment()
    }, [router.isReady])

    if (assignment_id == '') {
        return <>index</>
    }

    if (!user || !assignment) {
        return <>Loading...</>
    }

    return (
        <Margin
            user={user}
            availablePages={user.type == 'admin' ? admin_pages : student_pages}
            currentPageTitle={'Assignments'}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} lg={10}>
                    {assignment.name}
                </Grid>
                <Grid item xs={12} lg={10}>
                    {assignment.description}
                </Grid>
                <Grid item xs={12} lg={10}>
                    <Button variant="primary"> Submit </Button>
                </Grid>
            </Grid>
        </Margin >
    )
}