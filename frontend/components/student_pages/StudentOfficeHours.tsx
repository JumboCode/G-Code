// react imports
import React, { useState, useEffect } from 'react';

// mui imports
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TimeMenu } from '../../components/menus'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Modal from "@mui/material/Modal"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';

// filter icons
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';


// axios
import axios from 'axios';
import { Avatar } from '@mui/material';

// constants
import { numberToAMPM, weekDays, months } from '../../constants'

export default function StudentOfficeHours(props) {
    const user = props.user
    const [tutors, setTutors] = useState([])
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date()) 
    const [currentDay, setCurrentDay] = useState(new Date()) 

    const setCurrentDayTutors = (date : Date) => {
        setCurrentDay(date)
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        console.log(dateString)
        axios.get("http://localhost:8000/api/get_available_appointments?date=" + dateString).then(
            (res) => {
                let tutor_list = []
                for (let tutor_name in res.data) {
                    if (res.data[tutor_name].length > 0) {
                        tutor_list.push({
                            name: tutor_name,
                            times: res.data[tutor_name]
                        })
                    }
                }
                setTutors(tutor_list)
            }
        )
    }

    // useEffect(() => {
    //     axios.get('http://localhost:8000/api/appointments', {
    //         headers: {
    //             Accept: 'application/json'
    //         }
    //     })
    //         .then(response => {
    //             // handle success
    //             console.log(response)
    //             const appointments = response.data

    //             let tutor_dictionary = {}

    //             // build tutor dictionary
    //             for (const appointment in appointments) {
    //                 const tutor_name = appointments[appointment].tutorName
    //                 if (!(tutor_name in tutor_dictionary)) {
    //                     tutor_dictionary[tutor_name] = []
    //                 }
    //                 tutor_dictionary[tutor_name].push(appointments[appointment].startTime)
    //             }

    //             let appointment_array = []
    //             for (const tutor in tutor_dictionary) {
    //                 appointment_array.push({
    //                     name: tutor,
    //                     times: tutor_dictionary[tutor]
    //                 })
    //             }

    //             setTutors(appointment_array)

    //         })
    //         .catch(error => {
    //             // handle error
    //             console.log(error)
    //         })

    // }, [])

    // handle opening filter modal
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    const openFilterModal = () => setFilterModalOpen(true);
    const closeFilterModal = () => setFilterModalOpen(false);

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

    const handleFiltersFormSubmit = (event) => {
        event.preventDefault();
        // do something with backend
    }

    return (
        <div>
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
                            <Button variant="secondary" sx={{
                                marginTop: '20px',
                                }}
                                onClick={openFilterModal}
                            >
                                <TuneRoundedIcon />
                                Filters
                            </Button>
                        </Grid>
                    </Grid>

                    <CalendarWeek 
                        currentWeekStart={currentWeekStart}
                        setCurrentWeekStart={setCurrentWeekStart}
                        currentDay={currentDay}
                        setCurrentDay={setCurrentDayTutors}
                    />

                    <p style={{
                        color: '#61646D',
                    }}>
                        Appointments Available on {weekDays[currentDay.getDay()]}, {months[currentDay.getMonth()]} {currentDay.getDate()}
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
                    <p>Can&apos;t find a time?</p>
                    {/* </Grid>
                                    </Grid> */}
                    {/* <Grid item xs={12}> */}
                    <Button variant="secondary">Suggest New Times</Button>
                    {/* </Grid> */}
                    {/* <Grid item xs={12}> */}
                    {/* </Grid> */}
                </Grid>
            </Grid>
        </div>
    )
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

function TimeIntervalSelector({ bottom, setNumTimeIntervals, showDeleteButton }) {
    const button_style = { color: '#3D495C' };

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

function StudentHeading() {
    return <h2 style={{
        fontFamily: 'Poppins',
        color: '#29395B',
    }}>Got questions? Ask us!</h2>
}

function CalendarWeek({ currentWeekStart, setCurrentWeekStart, currentDay, setCurrentDay }) {
    let days = []
    let date = new Date(currentWeekStart)
    for (let i = 0; i < 7; i++) {
        let date_copy = new Date(date.getTime())
        days.push(<CalendarDay 
            dayName={weekDays[date.getDay()]} 
            dayNum={date.getDate()} 
            selected={currentDay.getTime() === date.getTime()}
            setCurrentDay={() => {setCurrentDay(date_copy)}}
        />)
        date.setDate(date.getDate() + 1) 
    }

    return <Box sx={{
        backgroundColor: 'white',
        width: '90%',
        boxShadow: '2px 2px 10px 2px rgba(142, 142, 142, 0.1)',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    }}>
        <ArrowLeftIcon 
            sx={{cursor: 'pointer'}}
            onClick={() => {setCurrentWeekStart(date => new Date(date.getTime() - 7 * 86400000))}}
        />
        {days}
        <ArrowRightIcon 
            sx={{cursor: 'pointer'}}
            onClick={() => {setCurrentWeekStart(date => new Date(date.getTime() + 7 * 86400000))}}
        />
    </Box>
}

function CalendarDay({ dayName, dayNum, selected, setCurrentDay }) {
    return <Box 
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: selected ? '2px solid #6A5DF9' : '',
            backgroundColor: selected ? '#F0EFFE' : 'white',
            borderRadius: '10px',
            padding: '0 20px',
            margin: '8px 0',
            cursor: 'pointer'
        }}
        onClick={setCurrentDay}
    >
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

function TutorProfile({ name, times }) {
    return <Box 
        sx={{
            backgroundColor: 'white',
            boxShadow: '2px 2px 15px rgba(194, 194, 194, 0.2)',
            borderRadius: '10px',
            padding: '10px',
        }}
        key={name}
    >
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <p>{name}</p>
                    <Avatar>{name[0]}</Avatar>
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
            {times.map(time => {
                return (
                <Grid item xs={12} md={3.33}>
                    <TimeBox time={numberToAMPM(time.start_time) + ' - ' + numberToAMPM(time.end_time)} />
                </Grid>)
            })}

            {/* <Grid item xs={12} md={2.5}>
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
            </Grid> */}
        </Grid>
    </Box>
}

function TimeBox({ time }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const booking_modal = {
        backgroundColor: "#fff",
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "10px",
        boxShadow: 24,
        p: 4,
    };


    return <Box>
        <Button sx={{
            border: '1px solid #D8D8DB',
            borderRadius: '12px',
            marginTop: '20px',
            width: '90%',
            }}
            onClick={handleOpen}
        >
            <p style={{ color: '#29395B', textAlign: 'center' }}>
                {time}
            </p>
        </Button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={booking_modal}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <p style={{textAlign: 'center'}}>Confirm booking for { time }?</p>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            variant="secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            variant="primary"
                            onClick={handleClose}
                        >
                            Confirm
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    </Box>
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