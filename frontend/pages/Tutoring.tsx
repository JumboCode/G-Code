import React from 'react';
import Sidebar from '../components/sidebar'
import styles from '../styles/Home.module.css'
import Heading from '../components/heading'
import Help from '../components/help'
import Filter from '../components/filter'

export default function Scheduling() {
    return (
        <div className={styles.container}>
            <Sidebar currentPageTitle="Tutoring" />
            <Heading />
            <Filter />
            <Help />
        </div>
    )
}
