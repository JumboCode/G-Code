import React from 'react'
import "@fontsource/poppins";

export default function Header() {
    return <div>
        <h1 style={styles.h1}>
            Office Hours This Week
        </h1>
        <p style={styles.p}>We are here to help!</p>
    </div>
}

let styles = {
    Header: {
        fontSize: '5vh',
    },
    h1: {
        fontFamily: 'Poppins',
        fontSize: '4vh',
        fontWeight: "700",
    },
    p: {
        fontFamily: 'Poppins',
        fontSize: '2.4vh',
    }
}