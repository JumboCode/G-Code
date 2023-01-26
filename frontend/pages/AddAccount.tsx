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
    name: '',
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
          width: 400,
          height: 'auto',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <form onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="First + Last Names"
              type="text"
              value={formVals.name}
              onChange={handleInput}
            />
            <TextField
              name="email"
              label="Email"
              type="text"
              value={formVals.email}
              onChange={handleInput}
            />
            
            <FormControl>
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
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  )
}
