import React, { Component, useState, useEffect } from 'react'
import axios from "axios";
import "@fontsource/poppins";
// import Grid from '@material-ui/core/Grid'

class Day_Selection extends Component<any, any> {

    state = {
        day_selected: new Date()
    };
    readonly today = new Date()

    /* Returns array containing string representation of next 7 days */
    get_days(): Date[] {
        let days: Date[] = new Array()
        let curr_day = new Date()
        curr_day.setDate(this.today.getDate())

        const DAYS_TO_DISPLAY = 7
        for (let i = 0; i < DAYS_TO_DISPLAY; i++) {
            days.push(curr_day)
            let temp = new Date(curr_day)
            temp.setDate(curr_day.getDate() + 1)
            curr_day = temp
        }
        return days
    }

    handleClick(day_selected: Date) {
        this.props.set_filter_date(day_selected) /* Updates state of parent component */
        this.setState({ day_selected: day_selected })
    }

    render() {
        let days_of_week: string[] = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
        var dayButtons = [];
        var days = this.get_days()
        for (let i = 0; i < 7; i++) {
            let curr_day_of_week = days_of_week[days[i].getDay()]
            //fetch_filtered_appointments({"dayOfWeek":days})
            dayButtons.push(<button type="button"
                key={days[i].toString()}
                onClick={() => this.handleClick(days[i])}>{curr_day_of_week + " "}{(days[i]).getDate()}
            </button>)
        }
        return (
            <div>
                {dayButtons}
            </div>
        )
    }
}


function Mentor({ mentor_name }) {

    // TODO: get all the timeslots for this mentor that also match the other filters

    return <div>
        <picture>
            <img src="./NyraRobinson.png" alt="Mentor Picture" />
        </picture>
        <h4 style={{
            fontFamily: 'Poppins',
            fontSize: '2.8',
        }}>
            {mentor_name}
        </h4>
        {/* <p>{timeslots_count} Slots</p> */}
        <button type="button" style={styles.ViewProfileButton}>View Profile</button>
        <TimeSlot
            time={"10:00 AM"}
        />
    </div>
}

function TimeSlot({ time }) {
    return <button type="button" style={styles.TimeSlotButton}>{time}</button>
}

function SessionView({ day, date }) {

    /* TODO: actually get list of mentors from database */
    var mentors = [];

    return (
        <div style={styles.SessionViewBox}>
            <div style={{
                backgroundColor: '#F6F6F6',
                fontFamily: 'Poppins',
            }}>
                <h3>Available Sessions on {day}, {date}</h3>
            </div>
            <Mentor
                mentor_name={"Nyra Robinson"}
            />
            <button style={styles.BookButton}>Book a Session for {date}</button>
        </div>
    )
}

export default function Filter() {
    const [day_selected, setDay] = useState(new Date());

    // React.useEffect(() => {
    //     axios.get("http://localhost:8000/api/appointments", { params: { dayOfWeek: 'Monday' } }).then((res) => {
    //         console.log(res.data)
    //     });
    // }, []);

    useEffect(() => {
        async function fetchDayData() {
            try {
                const response = await axios.get('http://localhost:8000/api/appointments', { params: { dayOfWeek: 'Monday' } });
                console.log(response.data)
                //setStudents(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchDayData();
    }, []);

    const get_day = new_day_selected => {
        setDay(new_day_selected)
    }

    function get_day_of_week(): string {
        let days_of_week: string[] = ['Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday',
            'Sunday']

        return days_of_week[day_selected.getDay()]
    }

    function get_month_abbreviation(): string {
        let month_abbreviations: string[] = ['Jan', 'Feb', 'Mar', 'Apr',
            'May', 'Jun', 'Jul', 'Aug',
            'Sep', 'Oct', 'Nov', 'Dec']
        return month_abbreviations[day_selected.getMonth()]
    }

    function get_day_of_month() {
        return day_selected.getDate()
    }

    return (
        <div>
            <Day_Selection set_filter_date={get_day} />
            <SessionView
                day={get_day_of_week()}
                date={get_month_abbreviation() + " " + get_day_of_month()}
            />
        </div>
    )
}

let styles = ({
    ViewProfileButton: {
        backgroundColor: 'F6F6F6',
        padding: '0.8vh 1.4vw',
        border: 'none',
        borderRadius: '30px',
        fontFamily: 'Poppins',
        fontSize: '2vh',
        cursor: 'pointer',
    },
    TimeSlotButton: {
        fontFamily: 'Poppins',
        fontWeight: '700',
        fontSize: '2.1vh',
        borderRadius: '10px',
        border: '0.6px solid #C0C0C0',
        backgroundColor: 'white',
        padding: '2vh 1.8vw',
        cursor: 'pointer',
    },
    BookButton: {
        fontFamily: 'Poppins',
        fontSize: '2vh',
        fontWeight: '400',
        borderRadius: '10px',
        backgroundColor: '#181D2C',
        width: '80%',
        color: 'white',
        padding: '2vh',
        cursor: 'pointer',
    },
    SessionViewBox: {
        border: '0.7px solid #C0C0C0',
        borderRadius: '10px',
        // width: '50vw',
        // height: '60vh',
    },
})