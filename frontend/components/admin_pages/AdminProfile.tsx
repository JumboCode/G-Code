import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import { Button } from "@mui/material"
import { Input, TextField } from "@mui/material"
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

export default function AdminProfile(props) {
    const user = props.user;
    const [editOpen, setEditOpen] = useState(false);
    const handleEdit = () => {
        setEditOpen(!editOpen);
    };

    return (
        <Box
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}
        >
            <Box>
                <Card sx={{ width: "500px" }}>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                        <Button onClick={handleEdit} sx={{ float: "right" }}>
                            <EditIcon />
                        </Button>
                        <Grid direction="column" spacing={2} container>
                            <Grid item xs={8}>
                                <h1>
                                    Profile
                                </h1>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    disabled={!editOpen}
                                    id="outlined-disabled"
                                    label="First Name"
                                    defaultValue={user["firstname"]}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    disabled
                                    id="outlined-disabled"
                                    label="Last Name"
                                    defaultValue={user["lastname"]}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    disabled
                                    id="outlined-disabled"
                                    label="email"
                                    defaultValue={user["email"]}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    disabled
                                    id="outlined-disabled"
                                    label="Password"
                                    defaultValue={"**************"}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    disabled={!editOpen}
                                    id="outlined-disabled"
                                    label="Zoom"
                                    defaultValue={(user["zoom"] = "") ? user["zoom"] : "none"}
                                />
                            </Grid>
                            <Grid sx={{ marginTop: "2%", marginLeft: "1%" }} container flex-direction="row" spacing={2}>
                                <Grid item xs={8}>
                                    {editOpen &&
                                        <Button variant="contained">
                                            Save
                                        </Button>
                                    }
                                </Grid>
                                <Grid item xs={8}>
                                    {editOpen &&
                                        <Button onClick={handleEdit} variant="outlined">
                                            Exit
                                        </Button>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
}