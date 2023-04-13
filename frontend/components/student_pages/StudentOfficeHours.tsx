import React from 'react';
import { Grid, Box } from "@mui/material";
import Button from '@mui/material/Button'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const tutors = [{
    name: 'Michelle Minns',
    imageUrl: 'NyraRobinson.png',
    times: ['10:30 AM', '11 AM', '11:30 AM', '8 PM', '8:30 PM', '9 PM']
}, {
    name: 'Laena Tyler',
    imageUrl: 'LaenaTyler.png',
    times: ['7 PM', '7:30 PM', '8 PM', '9 PM', '9:30 PM', '10 PM']
}]

export default function StudentOfficeHours(props) {
    const user = props.user

    return (
        <div style={{
            paddingTop: '40px'
        }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <StudentHeading />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button variant="secondary" sx={{
                                marginTop: '20px'
                            }}>
                                <TuneRoundedIcon />
                                Filters
                            </Button>
                        </Grid>
                    </Grid>
                    <CalendarWeek />
                    <p style={{
                        color: '#61646D',
                    }}>
                        Appointments Available on Tuesday, Nov 22
                    </p>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        width: '90%'
                    }}>
                        {tutors.map((tutor) => <TutorProfile {...tutor} />)}
                    </Box>
                    <Button sx={{
                        backgroundColor: '#61646D',
                        width: '90%',
                        marginTop: '20px',
                        color: 'white'
                    }}>
                        Continue →
                    </Button>
                </Grid>

                <Grid item xs={12} md={4}>
                    {/* <Grid container spacing={1}>
                                        <Grid item xs={12}> */}
                    <p>Can't find a time?</p>
                    {/* </Grid>
                                    </Grid> */}
                    {/* <Grid item xs={12}> */}
                    <Button variant="secondary">+ Suggest New Times</Button>
                    {/* </Grid> */}
                    {/* <Grid item xs={12}> */}
                    <Button variant="secondary">Check FAQ Board &#8594;</Button>
                    {/* </Grid> */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <p>Work Together</p>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button variant="secondary">+ New</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}


function StudentHeading() {
    return <h2 style={{
        fontFamily: 'Poppins',
        color: '#29395B',
    }}>Got questions? Ask us!</h2>
}

function CalendarWeek() {
    return <Box sx={{
        backgroundColor: 'white',
        width: '90%',
        boxShadow: '2px 2px 10px 2px rgba(142, 142, 142, 0.1)',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    }}>
        <ArrowLeftIcon />
        <CalendarDay dayName="Mon" dayNum={21} selected={false} />
        <CalendarDay dayName="Tues" dayNum={22} selected />
        <CalendarDay dayName="Wed" dayNum={23} selected={false} />
        <CalendarDay dayName="Thur" dayNum={24} selected={false} />
        <CalendarDay dayName="Fri" dayNum={25} selected={false} />
        <CalendarDay dayName="Sat" dayNum={26} selected={false} />
        <CalendarDay dayName="Sun" dayNum={27} selected={false} />
        <ArrowRightIcon />
    </Box>
}

function CalendarDay({ dayName, dayNum, selected }) {
    return <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: selected ? '2px solid #6A5DF9' : '',
        backgroundColor: selected ? '#F0EFFE' : 'white',
        borderRadius: '10px',
        padding: '0 20px',
        margin: '8px 0'
    }}>
        <p style={{
            color: selected ? '#6A5DF9' : '#29395B',
            fontSize: '14px'
        }}>
            {dayName}
        </p>
        <p style={{
            color: selected ? '#6A5DF9' : '#29395B',
            fontSize: '14px',
        }}>
            <b>{dayNum}</b>
        </p>
    </Box>
}

function TutorProfile({ name, imageUrl, times }) {
    return <Box sx={{
        backgroundColor: 'white',
        boxShadow: '2px 2px 15px rgba(194, 194, 194, 0.2)',
        borderRadius: '10px',
        padding: '10px',
    }}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={3.5}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <p>{name}</p>
                    <img src={imageUrl} />
                    <Button sx={{
                        color: '#29395B',
                        backgroundColor: '#F6F6F6',
                        padding: '5px 15px',
                        marginTop: '10px'
                    }}>
                        View Profile
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12} md={2.5}>
                <TimeBox time={times[0]} />
                <TimeBox time={times[3]} />
            </Grid>
            <Grid item xs={12} md={2.5}>
                <TimeBox time={times[1]} />
                <TimeBox time={times[4]} />
            </Grid>
            <Grid item xs={12} md={2.5}>
                <TimeBox time={times[2]} />
                <TimeBox time={times[5]} />
            </Grid>
        </Grid>
    </Box>
}

function TimeBox({ time }) {
    return <Box sx={{
        border: '1px solid #D8D8DB',
        borderRadius: '12px',
        marginTop: '20px',
    }}>
        <p style={{ color: '#29395B', textAlign: 'center' }}>
            {time}
        </p>
    </Box>
}
