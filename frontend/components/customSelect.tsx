import React from 'react'
import { Select, MenuItem } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function CustomSelect(props) {
    const value = props.value
    const handleChange = props.handleChange
    const choices = props.choices

    const iconComponent = (props) => {
        return (
          <ExpandMoreIcon className={props.className}/>
        )};
    
    return (
        <>
            <Select
                disableUnderline
                value={value}
                onChange={handleChange}
                sx={{
                    width: '100%',
                    height: '50px',
                    borderRadius: '10px',
                    backgroundColor: "white",
                    marginRight: 15,
                    borderStyle: 'none',
                    borderWidth: '2px',
                }}
                IconComponent={iconComponent}
            >
                {choices.map((choice) => (
                    <MenuItem
                        key={choice}
                        value={choice}
                    >
                        {choice}
                    </MenuItem>
                ))}
            </Select>
        </>
    )
}