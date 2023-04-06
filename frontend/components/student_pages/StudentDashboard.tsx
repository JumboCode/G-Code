import React from "react";
import { Grid, Box, CssBaseline, Button } from "@mui/material";
import HeaderNav from '../headernav';
import { DRAWER_WIDTH } from "../../constants";
import TutoringCardDisplay from "../tutoringCard";
import styles from '../../styles/Home.module.css'
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CommunityResourcesPanel from "../communityResourcesPanel";
import { useRouter } from "next/router";

export default function Dashboard(props) {
    const user = props.user
    const router = useRouter()

    // make call to backend to get real data
    const assignmentList = [
        {
            name: "Paired Programming Project Pt. 2",
            dueDate: "Fri, Nov 25, 10:59 PM"
        },
        {
            name: "Week 6 Module of Codecademy",
            dueDate: "Fri, Nov 25, 10:59 PM"
        },
    ]

    // make call to backend to get real data
    const eventList = [
        {
            name: "Discussion: Career Dev with Ryan Lester",
            eventDate: "Sun, Nov 27, 1:00-2:00 PM"
        },
        {
            name: "Guest Speaker: Joe Smith",
            eventDate: "Mon, Nov 28, 1:00-2:00 PM"
        },
        {
            name: "Guest Speaker: Michael Jordan",
            eventDate: "Tue, Nov 29, 7:00-9:00 PM"
        },
    ]

    if (user == null) {
        return <p> Loading... </p>
    } else return (
        <ThemeProvider theme={theme}>
            <Box className={styles.content} sx={{ display: 'flex' }}>
                <CssBaseline />
                <HeaderNav user={{ firstname: user.firstname }} currentPageTitle="Dashboard" />

                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
                >
                    <Grid container spacing={2}>
                        <Grid className={styles.header1} item xs={12}>
                            {/* get a firstname from backend */}
                            <p> Hey, {user["firstname"]} 🤟 </p>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <div className={styles.header2}>Coming Up Soon</div>
                            <div className={styles.pageElement}>
                                <TutoringCardDisplay sessions={2} />
                            </div>
                            <div className={styles.header2}>{assignmentList.length} Assignment{assignmentList.length > 1 && "s"}</div>

                            <List className={styles.pageElement} sx={{ backgroundColor: 'white' }}>
                                {assignmentList.map(assignment => (
                                    <ListItem
                                        key={assignment.name}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={() => {
                                                router.push('/Assignments')
                                            }}>
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

                            <div className={styles.header2}> {eventList.length} Event{eventList.length > 1 && "s"} </div>
                            <List className={styles.pageElement} sx={{ backgroundColor: 'white' }}>

                                {eventList.map(event => (
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
                                        <img src="FAQBoardIcon.svg" onClick={() => {
                                            router.push('/OfficeHours')
                                        }} /><br />
                                        Programming Help
                                        {/* NEED TO ADD PROPER LINK: GOES TO FAQBOARD */}
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={12} lg={6}>
                                    <div className={styles.question}>
                                        <img src="FAQBoardIcon.svg" onClick={() => {
                                            router.push('/FAQBoard')
                                        }} /><br />
                                        FAQ Board
                                    </div>
                                </Grid>
                            </Grid>

                            <div className={styles.header2}>Work Together</div>
                            <div className={styles.pageElement}>
                                <ListItemText
                                    primary={'Javascript Peers Study Session'}
                                    secondary={'Sun, Nov 27, 3:30 - 5:00 PM'}
                                />
                                <Button variant="secondary">
                                    Sign up
                                </Button>
                            </div>

                            <CommunityResourcesPanel />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </ThemeProvider>
    );
}