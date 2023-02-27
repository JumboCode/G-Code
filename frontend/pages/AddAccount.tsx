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
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';

export default function Resources() {
    const [open, setOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [messageColor, setMessageColor] = useState("red");

    const defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        accType: 'Student'
    };

    const [accounts, setAccounts] = useState([defaultValues]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleInput = (event, index) => {
        const { name, value } = event.target;

        setAccounts(
            accounts.map((acc, i) => {
                if (i == index) {
                    return { ...acc, [name]: value }
                }
                return acc;
            })
        );
    }

    const addInputRow = () => {
        setAccounts([...accounts, defaultValues])
    }

    const deleteInputRow = () => {
        if(accounts.length > 1)
            setAccounts(accounts.filter((acc, i) => i != accounts.length-1))
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        for (var i = 0; i<accounts.length; i++) {
            const acc = accounts[i]
            if (acc.firstName == "" || acc.lastName == "" || acc.email == "") {
                setMessageColor("red")
                setStatusMessage("Please make sure all fields are non-empty.")
                return
            }
        }

        axios.post('http://localhost:8000/api/create_users/', accounts)
            .then(() => {
                setMessageColor("green")
                setStatusMessage("Succesfully added " +
                    accounts.length + " students")
            })
            .catch(function (error) {
                console.log(error.response.data);
                setMessageColor("red")
                setStatusMessage(error.response.data.detail)
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
                            {accounts.map((_, i) =>
                                <StudentInput
                                    accounts={accounts}
                                    handleInput={handleInput}
                                    accountIndex={i}
                                    bottom={i == accounts.length-1}
                                    addRow={addInputRow}
                                    deleteRow={deleteInputRow}
                                />
                            )}
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                            <p style={{ color: messageColor }}>
                                {statusMessage}
                            </p>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

function StudentInput({ accounts, handleInput, accountIndex, bottom, addRow, deleteRow }) {
    const button_style = { color: '#3D495C' };
    
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
        {bottom && <>
            <IconButton onClick={addRow}>
                <AddRoundedIcon sx={button_style} />
            </IconButton>
            <IconButton onClick={deleteRow}>
                <DeleteOutlineOutlinedIcon sx={button_style} />
            </IconButton>
        </>}
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
