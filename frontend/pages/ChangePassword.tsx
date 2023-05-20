import { useState } from 'react'
import { ThemeProvider } from "@mui/material/styles"
import { theme } from '../theme'
import Header from "../components/header"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import TextField from '@mui/material/TextField'
import IsUserAuthorized from '../components/authentification'
import Button from '@mui/material/Button'
import { Alert, Typography } from '@mui/material'
import { changePassword, updateUser } from '../api/routes'
import { useRouter } from 'next/router'

export default function ChangePassword() {
    const [formData, setFormData] = useState({ currentpassword: '', newpassword: '', repeatnewpassword: '' });
    const [formError, setFormError] = useState('')
    const router = useRouter()

    const handleChangePassword = () => {
        changePassword(formData)
            .then(() => router.push('/Dashboard'))
            .catch(error => setFormError(error.response.data.detail))
    }

    const handleChange = (event) => {
        setFormData(formData => {
            return (
                {
                    ...formData,
                    [event.target.name]: event.target.value
                })
        })
    }

    return (
        <ThemeProvider theme={theme}>
            <Header handleDrawerToggle={() => { }} user={formData} />
            <Box
                sx={{
                    paddingTop: '70px',
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
                        <Grid item xs={12}> <Typography variant='h1'> Change Password</Typography> </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                label="Current Password"
                                variant="outlined"
                                type="password"
                                name="currentpassword"
                                value={formData.currentpassword}
                                onChange={handleChange}
                                error={false}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                label="New Password"
                                variant="outlined"
                                name="newpassword"
                                type="password"
                                value={formData.newpassword}
                                onChange={handleChange}
                                error={false}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                label="Repeat New Password"
                                name="repeatnewpassword"
                                variant="outlined"
                                value={formData.repeatnewpassword}
                                onChange={handleChange}
                                type="password"
                                error={false}
                                fullWidth
                            />
                        </Grid>

                        {formError && <Grid item xs={12}>
                            <Alert severity="error"> {formError} </Alert>
                        </Grid>}

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                                <Button onClick={handleChangePassword} variant="primary"> Change Password </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </ThemeProvider>
    )
}