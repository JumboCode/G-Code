import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function DropDownMenu({ options, width }) {

  const [val, setVal] = useState(options[0]);

  return <FormControl sx={{
    width: width,
  }}>
    <Select
      value={val}
      displayEmpty
      onChange={(event) => setVal(event.target.value)}
      sx={{
        height: '30px',
        fontFamily: 'Poppins',
        backgroundColor: 'white'
      }}
    >
      {options.map(option =>
        <MenuItem value={option} key={option} sx={{ fontFamily: 'Poppins' }}>
          {option}
        </MenuItem>)}
    </Select>
  </FormControl>;
}

function TimeMenu() {
  return <DropDownMenu
    width="120px"
    options={[
      '9:00 AM',
      '9:30 AM',
      '10:00 AM',
      '10:30 AM',
      '11:00 AM',
      '11:30 AM',
      '12:00 PM',
      '12:30 PM',
      '1:00 PM',
      '1:30 PM',
      '2:00 PM',
      '2:30 PM',
      '3:00 PM',
      '3:30 PM',
      '4:00 PM',
      '4:30 PM',
      '5:00 PM',
      '5:30 PM',
      '6:00 PM',
      '6:30 PM',
      '7:00 PM',
      '7:30 PM',
      '8:00 PM',
      '8:30 PM',
      '9:00 PM'
    ]} />;
}

export { DropDownMenu, TimeMenu };
