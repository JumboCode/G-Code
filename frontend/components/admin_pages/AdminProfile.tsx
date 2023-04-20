import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { Input, TextField } from '@mui/material'
export default function AdminProfile(props) {
    const user = props.user
    return (
        <Box
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}
        >
            <Box>
                <Card sx={{ width: '500px' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Grid container>
                            <Grid item xs="12">
                                <h1>
                                    Profile
                                </h1>
                            </Grid>
                            <Grid item xs="6">
                                Name: {user["firstname"]}
                            </Grid>
                            <Grid item xs="6">
                                {/* <TextField
                                    variant=‘outlined’
                                    type=‘text’
                                    fullWidth
                                /> */}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
}