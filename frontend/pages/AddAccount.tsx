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
    const [error_message, setErrorMessage] = useState(null);

    const defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        accType: 'Student'
    };

    const [accounts, setAccounts] = useState([defaultValues, defaultValues]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleInput = (event, index) => {
        const { name, value } = event.target;
        console.log(index)
        let temp = accounts.slice();
        temp[index][name] = value;
        console.log(...temp)
        setAccounts(temp);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:8000/api/create_users/', accounts)
            .then(() => {
                setErrorMessage(null)
            })
            .catch(function (error) {
                console.log(error.response.data);
                setErrorMessage(error.response.data.detail)
            })
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
                            <StudentInput 
                                accounts={accounts}
                                handleInput={handleInput}
                                accountIndex={0} 
                            />
                            <StudentInput 
                                accounts={accounts}
                                handleInput={handleInput}
                                accountIndex={1} 
                            />
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                            <p className={styles.error_message}>{error_message}</p>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

function StudentInput({ accounts, handleInput, accountIndex }) {
    return <Box sx={{
        display: 'flex',
        gap: '5px'
    }}>
        <TextInput
            name="firstName"
            label="First Name"
            index={accountIndex}
            val={accounts[accountIndex].firstName}
            handleInput={handleInput} />
        <TextInput
            name="lastName"
            label="Last Name"
            index={accountIndex}
            val={accounts[accountIndex].lastName}
            handleInput={handleInput} />
        <TextInput
            name="email"
            label="Email"
            index={accountIndex}
            val={accounts[accountIndex].email}
            handleInput={handleInput} />
        <FormControl sx={{ width: '150px' }}>
            <Select
                name="accType"
                value={accounts[accountIndex].accType}
                onChange={(e) => handleInput(e, accountIndex)}
            >
                <MenuItem key={0} value="Student">
                    Student
                </MenuItem>
                <MenuItem key={1} value="Tutor">
                    Tutor
                </MenuItem>
            </Select>
        </FormControl>
    </Box>
}

function TextInput({ name, label, val, handleInput, index }) {
    return <TextField
        name={name}
        label={label}
        type="text"
        value={val}
        onChange={(e) => handleInput(e, index)}
        sx={{ width: '150px' }}
    />
}
