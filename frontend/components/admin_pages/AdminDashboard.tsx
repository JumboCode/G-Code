import React from "react";
import { Grid, Button } from "@mui/material";
import TutoringCardDisplay from "../tutoringCard";
import styles from "../../styles/Home.module.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CommunityResourcesPanel from "../communityResourcesPanel";

export default function AdminDashboard(props) {
    const user = props.user
    // make call to backend to get real data
    const assignmentList = [
        {
            name: "Paired Programming Project Pt. 23456789",
            dueDate: "Fri, Nov 25, 10:59 PM",
        },
        {
            name: "Week 6 Module of Codecademy",
            dueDate: "Fri, Nov 25, 10:59 PM",
        },
    ];

    // make call to backend to get real data
    const eventList = [
        {
            name: "Discussion: Career Dev with Ryan Lester",
            eventDate: "Sun, Nov 27, 1:00-2:00 PM",
        },
        {
            name: "Guest Speaker: Joe Smith",
            eventDate: "Mon, Nov 28, 1:00-2:00 PM",
        },
        {
            name: "Guest Speaker: Michael Jordan",
            eventDate: "Tue, Nov 29, 7:00-9:00 PM",
        },
    ];
    return (
        <Grid container spacing={2}>
            <Grid className={styles.header1} item xs={12}>
                <p> Hey, {user["firstname"]} 🤟 </p>
            </Grid>
            <Grid item xs={12} md={8}>
                <div className={styles.header2}>Coming Up Soon</div>
                <div className={styles.pageElement}>
                    <TutoringCardDisplay />
                </div>
                <div className={styles.header2}>
                    {assignmentList.length} Assignment
                    {assignmentList.length > 1 && "s"}
                </div>

                <List
                    className={styles.pageElement}
                    sx={{ backgroundColor: "white" }}
                >
                    {assignmentList.map((assignment) => (
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
                                    <img src="./AssignmentIcon.svg" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={assignment.name}
                                secondary={assignment.dueDate}
                            />
                        </ListItem>
                    ))}
                </List>

                <div className={styles.header2}>
                    {" "}
                    {eventList.length} Event{eventList.length > 1 && "s"}{" "}
                </div>
                <List
                    className={styles.pageElement}
                    sx={{ backgroundColor: "white" }}
                >
                    {eventList.map((event) => (
                        <ListItem key={event.name}>
                            <ListItemAvatar>
                                <Avatar sx={{ backgroundColor: "#F5F7F9" }}>
                                    <img src="./EventIcon.svg" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={event.name}
                                secondary={event.eventDate}
                            />
                        </ListItem>
                    ))}
                </List>
            </Grid>
            <Grid item xs={12} md={4}>
                <div className={styles.header2}> Ask Somebody </div>

                <Grid container spacing={2}>
                    <Grid item xs={6} md={12} lg={6}>
                        <div className={styles.question}>
                            <img src="FAQBoardIcon.svg" />
                            <br />
                            Programming Help
                        </div>
                    </Grid>
                    <Grid item xs={6} md={12} lg={6}>
                        <div className={styles.question}>
                            <img src="FAQBoardIcon.svg" />
                            <br />
                            FAQ Board
                        </div>
                    </Grid>
                </Grid>

                <div className={styles.header2}>Work Together</div>
                <div className={styles.pageElement}>
                    <ListItemText
                        primary={"Javascript Peers Study Session"}
                        secondary={"Sun, Nov 27, 3:30 - 5:00 PM"}
                    />
                    <Button variant="secondary">Sign up</Button>
                </div>

                <CommunityResourcesPanel />
            </Grid>
        </Grid>
    );
}