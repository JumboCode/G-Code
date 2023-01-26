import React, { useState } from 'react';
import Sidebar from '../components/sidebar'
import styles from '../styles/Home.module.css'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';

export default function Resources() {
    const [open, setOpen] = useState(false);

    const defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        accType: 'Student'
    };

    const [formVals, setFormVals] = useState(defaultValues);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleInput = (event) => {
        const { name, value } = event.target;
        setFormVals({
            ...formVals,
            [name]: value,
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8000/api/create_user/', formVals)
    }

    return (
        <div className={styles.container}>
            <Sidebar currentPageTitle="AddAccount" />
            <Button onClick={handleOpen}>Add Account</Button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    // width: ,
                    height: 'auto',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                gap: '5px'
                                // width: 'auto',

                            }}>
                                <TextInput
                                    name="firstName"
                                    label="First Name"
                                    val={formVals.firstName}
                                    handleInput={handleInput} />
                                <TextInput
                                    name="lastName"
                                    label="Last Name"
                                    val={formVals.lastName}
                                    handleInput={handleInput} />
                                <TextInput
                                    name="email"
                                    label="Email"
                                    val={formVals.email}
                                    handleInput={handleInput} />
                                <FormControl sx={{ width: '150px' }}>
                                    <Select
                                        name="accType"
                                        value={formVals.accType}
                                        onChange={handleInput}
                                    >
                                        <MenuItem key={0} value="Student">
                                            Student
                                        </MenuItem>
                                        <MenuItem key={0} value="Tutor">
                                            Tutor
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

function TextInput({ name, label, val, handleInput }) {
    return <TextField
        name={name}
        label={label}
        type="text"
        value={val}
        onChange={handleInput}
        sx={{ width: '150px' }}
    />
}
