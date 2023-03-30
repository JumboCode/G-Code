import React from 'react';
import FaceIcon from '@mui/icons-material/Face';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Header() {
    return (
        <>
            <div style={styles.Header}>
                {/* <TextLabel text='User Name' /> */}
                <FaceIcon />
                <p> Name </p>
                <ArrowDropDownIcon />
            </div>
        </>
    );
};

let styles = ({
    Header:
    {
        background: 'white',
        display: 'flex',
        flexDirection: 'row',
        width: '9%',
        height: '5vh',
        gap: '3vh',
        alignItems: 'center',
        borderRight: '1px solid #DFDFDF',
        fontFamily: "Poppins",
        fontSize: '14px',
    },
})