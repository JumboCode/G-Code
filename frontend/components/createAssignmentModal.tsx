import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React from 'react'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from 'dayjs';
import Cookie from 'js-cookie'
import axios from 'axios'

const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function CreateAssignmentModal({ open, handleClose }) {
    const token = Cookie.get('gcode-session')

    const [assignmentName, setAssignmentName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [assignmentDue, setAssignmentDue] = React.useState(dayjs(new Date()));

    const saveAssignment = () => {
        const apiUrl = 'http://localhost:8000/api/assignment';
        const headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        };
        const requestData = {
            name: assignmentName,
            description: description,
            dueDate: assignmentDue,
        };
        axios.post(apiUrl, requestData, { headers })
            .then(_ => {
                handleClose()
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                >
                    Add an Assignment
                </Typography>
                <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Assignment Title"
                    variant="outlined"
                    sx={{ marginBottom: "10px" }}
                    value={assignmentName}
                    onChange={(event) => setAssignmentName(event.target.value)}
                />
                <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Assignment Details"
                    multiline
                    maxRows={20}
                    minRows={5}
                    variant="outlined"
                    sx={{ marginBottom: "10px" }}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={assignmentDue}
                        onChange={(newValue) => setAssignmentDue(newValue)}
                        label="Due Date" />
                </LocalizationProvider>
                <div>
                    <Button
                        variant="secondary"
                        sx={{ marginTop: "10px", marginLeft: "10px" }}
                        size="large"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        sx={{ marginTop: "10px" }}
                        variant="primary"
                        size="large"
                        onClick={() => {
                            saveAssignment();
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </Box>
        </Modal>
    )
}