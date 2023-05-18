import React from "react";
import dashboardStyles from "../styles/Dashboard.module.css";

// mui imports
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'
import { dateToString, formatAMPM } from '../constants'

import Link from 'next/link'
import Image from "next/image";
import GreenCircle from "../public/green.png";
import styles from '../styles/Home.module.css'


export default function AssignmentList({ assignmentList }) {
    return (
        <List className={styles.pageElement} sx={{ backgroundColor: 'white' }}>
            {assignmentList.map(assignment => (
                <Link key={assignment} href={"/Assignments/" + assignment._id}>
                    <ListItem
                        key={assignment.name}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                                <ArrowForwardIosIcon />
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ backgroundColor: "#F5F7F9" }}>
                                <Image src={GreenCircle} alt="Assignment Icon" />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={assignment.name}
                            secondary={"Due " + dateToString(new Date(assignment.dueDate)) + " at " + formatAMPM(assignment.dueDate)}
                        />
                    </ListItem>
                </Link>
            ))}
        </List>
    )
}
