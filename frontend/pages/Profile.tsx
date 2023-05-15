import { useState } from 'react'
import { ThemeProvider } from "@mui/material/styles"
import { theme } from '../theme'
import Header from "../components/header"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import TextField from '@mui/material/TextField'
import IsUserAuthorized from '../components/authentification'
import Button from '@mui/material/Button'
import { Typography } from '@mui/material'
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Profile() {
    const [formData, setFormData] = useState(null);

    const update_user = () => {
        const token = Cookies.get("gcode-session")

        const apiUrl = 'http://localhost:8000/api/user_by_id';

        const headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        };

        axios.put(apiUrl, formData, { headers })
            .then(response => {
                // console.log(response)
                setFormData(response.data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const save_user = curr_user => {
        if (formData == null) {
            setFormData(curr_user)
        }
    }
    IsUserAuthorized(save_user)

    const handleChange = (event) => {
        setFormData(formData => {
            return (
                {
                    ...formData,
                    [event.target.name]: event.target.value
                })
        })
    }

    if (!formData) {
        return <>loading...</>
    }
    return (
        <ThemeProvider theme={theme}>
            <Header user={formData} />
            <Box
                sx={{
                    paddingTop: '40px',
                    display: 'flex',
                    minHeight: '100vh',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F9FAFB'
                }}
            >
                <Box
                    sx={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        width: '600px',
                        boxShadow: '1.94772px 1.94772px 9.73859px rgba(142, 142, 142, 0.1)'
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}> <Typography variant='h1'> My Profile </Typography> </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="outlined-basic"
                                label="First Name"
                                variant="outlined"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                error={false}
                                fullWidth
                            // helperText={
                            //     "Please enter a title"
                            // }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="outlined-basic"
                                label="Last Name"
                                variant="outlined"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                error={false}
                                fullWidth
                            // helperText={
                            //     "Please enter a title"
                            // }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                label="Email"
                                name="email"
                                variant="outlined"
                                value={formData.email}
                                onChange={handleChange}
                                error={false}
                                fullWidth
                                disabled={true}
                            // helperText={
                            //     "Please enter a title"
                            // }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                label="Zoom Link"
                                variant="outlined"
                                name="zoom"
                                value={formData.zoom}
                                onChange={handleChange}
                                error={false}
                                fullWidth
                            // helperText={
                            //     "Please enter a title"
                            // }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                                <Button onClick={update_user} variant="primary"> Save Changes </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </ThemeProvider>
    )
}