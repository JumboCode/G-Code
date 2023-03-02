import React, { useState } from 'react';
import styles from '../styles/Home.module.css'
import { DropDownMenu, TimeMenu } from '../components/menus'
import Switch from '@mui/material/Switch';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme.ts'
import { Grid, Box, CssBaseline, MenuItem } from "@mui/material";
import HeaderNav from '../components/headernav.tsx';
import { DRAWER_WIDTH } from '../constants';
import Chip from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { ArrowRight } from '@mui/icons-material';
import Modal from '@mui/material/Modal';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// import StudentScheduling from '../components/StudentScheduling.tsx';

const button_style = { color: '#3D495C' };
const is_student = true

const tutors = [{
    name: 'Michelle Minns',
    imageUrl: 'NyraRobinson.png',
    times: ['10:30 AM', '11 AM', '11:30 AM', '8 PM', '8:30 PM', '9 PM']
}, {
    name: 'Laena Tyler',
    imageUrl: 'LaenaTyler.png',
    times: ['7 PM', '7:30 PM', '8 PM', '9 PM', '9:30 PM', '10 PM']
}]


const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function Scheduling() {
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    const openFilterModal = () => setFilterModalOpen(true);
    const closeFilterModal = () => setFilterModalOpen(false);

    // const [selectedFilterDays, setSelectedFilterDays] =
    //     useState([true, true, true, true, true, true, true]);

    // const isAllDays = () => selectedFilterDays.filter((val) => val == false).length == 0;
    // const dayIsSelected = (dayIndex) => selectedFilterDays[dayIndex] && !isAllDays();

    const handleFiltersFormSubmit = (event) => {
        event.preventDefault();
        // do something with backend
    }

    const names = [
        'Michelle Minns',
        'Laena Tyler',
    ];

    const [personName, setPersonName] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleDelete = (e: React.MouseEvent, value: string) => {
        e.preventDefault();
        console.log("clicked delete");
        setPersonName(personName.filter((name) => name !== value));
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <HeaderNav currentPageTitle="Office Hours" />
                <Box
                    component="main"
                    className={styles.content}
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
                >
                    {
                        is_student &&
                        <div style={{
                            paddingTop: '40px'
                        }}>
                            <Modal
                                open={filterModalOpen}
                                onClose={closeFilterModal}
                            >
                                <Box sx={{
                                    position: 'absolute' as 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    // width: ,
                                    height: 'auto',
                                    bgcolor: 'background.paper',
                                    border: '2px solid #000',
                                    boxShadow: 24,
                                    p: 4,
                                }}>
                                    <form onSubmit={handleFiltersFormSubmit}>
                                        <h3>Days</h3>
                                        <FilterDayButton text='All' />
                                        <FilterDayButton text='Mon' />
                                        <FilterDayButton text='Tues' />
                                        <FilterDayButton text='Wed' />
                                        <FilterDayButton text='Thurs' />
                                        <FilterDayButton text='Fri' />
                                        <FilterDayButton text='Sat' />
                                        <FilterDayButton text='Sun' />
                                        <h3>Time</h3>
                                        <TimeIntervalFilters />
                                        <h3>Instructors</h3>
                                        <Select
                                            multiple
                                            value={personName}
                                            onChange={handleChange}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip 
                                                            key={value}
                                                            label={value}
                                                            variant='outlined'
                                                            onDelete={(e) => handleDelete(e, value)}
                                                            onMouseDown={(event) => {
                                                                event.stopPropagation();
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {names.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <br />
                                        <Button sx={{
                                            marginLeft: '60%',
                                            color: '#595959',
                                            border: '1px solid #D9D9D9',
                                            padding: '10px 15px'
                                        }}>
                                            Reset
                                        </Button>
                                        <Button sx={{
                                            color: 'white',
                                            backgroundColor: '#6A5DF9',
                                            marginLeft: '5%',
                                            padding: '10px 15px'
                                        }}>
                                            Show 3 Results
                                        </Button>
                                    </form>
                                </Box>
                            </Modal>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={9}>
                                            <StudentHeading />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Button
                                                variant="secondary"
                                                sx={{
                                                    marginTop: '20px'
                                                }}
                                                onClick={openFilterModal}
                                            >
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

                                <Grid item xs={12} lg={4} spacing={2}>
                                    <p>Can't find a time?</p>
                                    <Button variant="secondary">+ Suggest New Times</Button>
                                    <Button variant="secondary">Check FAQ Board &#8594;</Button>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={9}>
                                            <p>Work Together</p>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Button variant="secondary">+ New</Button>
                                        </Grid>
                                        <Grid>
                                            <div className={styles.pageElement}>
                                                <ListItemText
                                                    primary={'Javascript Peers Study Session'}
                                                    secondary={'Sun, Nov 27, 3:30 - 5:00 PM'}
                                                />
                                                <Button variant="secondary">
                                                    Sign up
                                                </Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    }
                    {
                        !is_student &&
                        <div style={tutoring_styles.ScheduleContainer}>
                            <PageHeading />
                            <AvailableSessionsSection />
                            <h2 style={{ ...tutoring_styles.SubHeading }}>
                                Available Times for Signup
                            </h2>

                            <TableContainer className={styles.pageElement} component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableBody>
                                        {
                                            days.map(day => (
                                                <DayRow dayName={day} />
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    }
                </Box>
            </Box>
        </ThemeProvider >
    )
}


function StudentHeading() {
    return <h2 style={{
        fontFamily: 'Poppins',
        color: '#29395B',
    }}>Got questions? Ask us!</h2>
}

function FilterDayButton({ text }) {
    const [selected, setSelected] = useState(text == 'All' ? true : false);
    return <Button disableRipple sx={{
        backgroundColor: '#F7F8FA',
        border: `1px solid ${selected ? '#6A5DF9' : '#F7F8FA'}`,
        color: selected ? '#6A5DF9' : 'black',
        margin: '5px',
        padding: '0 7px'
    }}
        onClick={() => setSelected(!selected)}>
        {text}
    </Button>

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

function TimeIntervalFilters() {
    const [numTimeIntervals, setNumTimeIntervals] = useState(1);

    return <>
        {Array(numTimeIntervals).fill(0).map((_, index) =>
            <TimeIntervalSelector
                bottom={index === (numTimeIntervals - 1)}
                key={index}
                setNumTimeIntervals={setNumTimeIntervals}
                showDeleteButton={numTimeIntervals > 1 && index === numTimeIntervals - 1} />
        )}
    </>
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

function PageHeading() {
    return (
        <div style={tutoring_styles.PageHeadingContainer}>
            <h1>Office Hours Schedule</h1>
            {/* <h3 style={tutoring_styles.TimeZone}> Time Zone </h3> */}
            <DropDownMenu
                width={'auto'}
                options={[
                    'Eastern Time',
                    'Pacific Time',
                ]} />
            <div style={tutoring_styles.CheckBox}>
                <Checkbox disableRipple />
                <p>Make this the default schedule</p>
            </div>
        </div>
    )
}

function AvailableSessionsSection() {
    return (
        <div style={tutoring_styles.AvailableSessionsContainer}>
            <h2 style={tutoring_styles.SubHeading}>
                Available Sessions
            </h2>
            <DropDownMenu
                width="110px"
                options={[
                    '1 slot',
                    '2 slots',
                    '3 slots',
                    '4 slots',
                    '5 slots',
                    '6 slots',
                    '7 slots',
                    '8 slots',
                    '9 slots',
                    '10 slots',
                ]} />
        </div>
    )
}

function DayRow({ dayName }) {
    const [numTimeIntervals, setNumTimeIntervals] = useState(1);
    return (
        <TableRow
            key={dayName}
            sx={{ borderColor: 'white' }}
        >
            <TableCell sx={{ borderColor: 'white', padding: '2px' }} component="th" scope="row">
                <h2 style={tutoring_styles.DayName}>
                    {dayName}
                </h2>
            </TableCell>
            <TableCell sx={{ borderColor: 'white', padding: '2px' }} align="right">
                <div style={tutoring_styles.SwitchContainer}>
                    <Switch checked={numTimeIntervals > 0} onChange={
                        (event) => setNumTimeIntervals((old) => (old == 0 ? 1 : 0))
                    } />
                </div>
            </TableCell>
            <TableCell sx={{ borderColor: 'white', padding: '2px' }} align="right">
                {Array(numTimeIntervals).fill(0).map((_, index) =>
                    <TimeIntervalSelector
                        bottom={index === (numTimeIntervals - 1)}
                        key={index}
                        setNumTimeIntervals={setNumTimeIntervals}
                        showDeleteButton={index === numTimeIntervals - 1} />
                )}
            </TableCell>
        </TableRow>
    );
}

function TimeIntervalSelector({ bottom, setNumTimeIntervals, showDeleteButton }) {
    return <div style={tutoring_styles.TimeIntervalSelector}>
        <TimeMenu />
        TO
        <TimeMenu />
        {bottom && <>
            <IconButton onClick={() => setNumTimeIntervals((old) => old + 1)}>
                <AddRoundedIcon sx={button_style} />
            </IconButton>
            {showDeleteButton &&
                <IconButton onClick={() => {
                    setNumTimeIntervals((old) => old - 1);
                }}>
                    <DeleteOutlineOutlinedIcon sx={button_style} />
                </IconButton>
            }
        </>}
    </div>
}

const tutoring_styles = ({
    PageHeadingContainer:
    {
        paddingTop: '50px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '3%'
    },
    DayRow:
    {
        display: 'flex',
        flexDirection: 'row',
        height: 'auto',
        gap: '1%',
        marginLeft: '10px'
    },
    DayName:
    {
        fontSize: '19px',
        lineHeight: '25px',
        fontFamily: 'Red Hat Display',
    },
    WeekContainer:
    {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #DFDFDF',
        backgroundColor: 'white',
        borderRadius: '20px'
    },
    ScheduleContainer:
    {
        display: 'flex',
        flexDirection: 'column',
    },
    DayNameContainer:
    {
        width: '10%',
        height: '50px'
    },
    CheckBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'right',
        alignItems: 'right',
        marginLeft: 'auto',
        fontFamily: 'Poppins',
    },
    TimeZone: {
        fontFamily: 'Poppins',
        fontSize: '18px',
        marginRight: '0px',
    },
    SwitchContainer:
    {
        display: 'flex',
        alignItems: 'center',
        height: '50px',
        width: '10%'
    },
    TimeIntervalSelector:
    {
        display: 'flex',
        gap: '3%',
        width: '400px',
        alignItems: 'center',
        height: '50px'
    },
    TimeIntervalStack:
    {
        display: 'flex',
        flexDirection: 'column',
    },
    AvailableSessionsContainer:
    {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px'
    },
    SubHeading:
    {
        fontSize: '18px'
    },
})
