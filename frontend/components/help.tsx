import React from 'react'
// import { Link } from 'react-router';
import Header from '../components/header'
import "@fontsource/poppins";

export default function Help() {
    return <div>
        <Header />
        <picture>
            <img src="./holding-pencil.svg" alt="" />
        </picture>
        <h4 style={styles.h4}>Can&#39;t find a time?</h4>
        <button style={styles.HelpButton}>Request Different Times</button>
        {/* <Link to="/react">Check out commonly asked questions &#62;</Link> */}
        <button style={styles.HelpButton}>Check FAQ Board</button>
    </div>
}

let styles = {
    h4: {
        fontFamily: 'Poppins',
        fontSize: '2vh'
    },
    HelpButton: {
        backgroundColor: 'F6F6F6',
        width: '14vw',
        height: '7.2vh',
        border: 'none',
        borderRadius: '30px',
        fontFamily: 'Poppins',
        fontSize: '2vh',
        fontWeight: '700',
        cursor: 'pointer',
    },
}