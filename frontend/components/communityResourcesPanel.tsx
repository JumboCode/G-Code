import React from "react"
import styles from "../styles/Home.module.css"
import { useRouter } from 'next/router';

export default function CommunityResourcesPanel() {
    const router = useRouter();
    return (
        <>
            <div className={styles.header2}>Community Resources</div>
            <div className={styles.pageElement} onClick={() => {
                      router.push('/Resources')}}>
                Class Materials
                <div style={{ float: "right" }}>{">"}</div>
            </div>
            <div className={styles.pageElement} onClick={() => {
                      router.push('/People')}}>
                People Directory
                <div style={{ float: "right" }}>{">"}</div>
            </div>
        </>
    )
}