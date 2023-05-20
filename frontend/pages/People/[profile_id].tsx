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
import { Typography, Box } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";
import "@fontsource/inter";
import Cookies from 'js-cookie'
import { getUser } from "../../api/routes";

export default function ProfileDetails() {
    const router = useRouter()
    const { profile_id } = router.query

    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null);
    const fields = ['firstname', 'lastname', 'pronouns', 'email', 'bio', 'timezone', 'linkedin', 'github', 'zoom']

    const save_user = curr_user => {
        if (user == null) {
            setUser(curr_user)
        }
    }
    IsUserAuthorized(save_user)

    useEffect(() => {
        getUser(profile_id, setProfile)
    }, [profile_id])

    if (profile_id == '') {
        return <>index</>
    }

    if (!user || !profile) {
        return <>Loading...</>
    }

    const filteredFields = fields.filter(field => profile[field] != "string");

    return (
        <Margin
            user={user}
            availablePages={user.type == 'admin' ? admin_pages : student_pages}
            currentPageTitle={'People'}
        >
        <>
        <Box sx={{ m: 10}}/>
            <Typography sx={{ fontWeight: 600, textTransform: 'capitalize', textAlign: 'center'  }}>
                    {profile.firstname} {profile.lastname}
            </Typography>
            <Box sx={{m: 10}}/>

            <Grid container spacing={2}>
              {filteredFields.map(field => (
                <>
                <Grid item xs={4}/>
                <Grid item xs={2} key={field}>
                  {field}:
                </Grid>
                <Grid item xs={2} key={field}>
                  {profile[field]}
                </Grid>
                <Grid item xs={4}/>
                </>
              ))}
            </Grid>
        </>
        </Margin>
    )
}