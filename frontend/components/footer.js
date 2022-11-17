import React from 'react';

// function Footer({ text }) {
//     return <div style={styles.Footer}>
//         {text}
//     </div>;
// }

export default function Footer() {
    return (
        <div style={styles.Footer}>
            <p>Copyright: G-Code</p>
        </div>
    )
}

let styles = ({
    Footer:
    {
        bottom: 0,
        height: '12vh',
        width: '100%',
        background: 'peach',
    },
})