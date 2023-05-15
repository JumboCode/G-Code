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
    const { profile_id } = router.query

    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null);

    const save_user = curr_user => {
        if (user == null) {
            setUser(curr_user)
        }
    }
    IsUserAuthorized(save_user)

    const getProfile = () => {
        // Todo: write call to get profile
        const apiUrl = 'http://localhost:8000/api/user_by_id';

        const headers = {
            'accept': 'application/json',
        };

        axios.get(`${apiUrl}?user_id=${profile_id}`, { headers })
            .then(response => {
                setProfile(response.data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getProfile()
    }, [router.isReady])

    if (profile_id == '') {
        return <>index</>
    }

    if (!user || !profile) {
        return <>Loading...</>
    }

    return (
        <Margin
            user={user}
            availablePages={user.type == 'admin' ? admin_pages : student_pages}
            currentPageTitle={'FAQBoard'}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} lg={10}>
                    Profile of {profile.firstname} {profile.lastname}
                </Grid>
            </Grid>
        </Margin >
    )
}