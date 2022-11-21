import React from 'react';
import Sidebar from '../components/sidebar'
import styles from '../styles/Home.module.css'


export default function Resources() {
    return (
        <div className={styles.container}>
            <Sidebar currentPageTitle="Resources" />
        </div>
    )
}
