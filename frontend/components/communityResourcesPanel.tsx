import React from "react"
import styles from "../styles/Home.module.css"

export default function CommunityResourcesPanel() {
    return (
        <>
            <div className={styles.header2}>Community Resources</div>
            <div className={styles.pageElement}>
                Class Materials
                <div style={{ float: "right" }}>{">"}</div>
            </div>
            <div className={styles.pageElement}>
                People Directory
                <div style={{ float: "right" }}>{">"}</div>
            </div>
        </>
    )
}