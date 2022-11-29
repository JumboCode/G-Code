import React, { Component, useState } from 'react'
import "@fontsource/poppins";

class Day_Selection extends Component {
    
    state = {
        day_selected: new Date()
    };
    readonly today = new Date()
   
    /* Returns array containing string representation of next 7 days */
    get_days():string[] {
        let days:Date[] = new Array()  
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
        this.setState({day_selected: day_selected})
    }

    render(){
        let days_of_week: string[] = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
        var dayButtons = [];
        var days = this.get_days()
        for (let i = 0; i < 7; i++) { 
            let curr_day_of_week = days_of_week[days[i].getDay()]
            dayButtons.push(<button type="button"
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
        {/* <img src="" alt="Profile Picture" /> */}
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
            <h3>Duration - 30 Minutes</h3>
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

    
    const get_day = new_day_selected => {
        setDay(new_day_selected)
    }

    function get_day_of_week():string {
        let days_of_week: string[] = ['Monday', 'Tuesday', 'Wednesday', 
                                      'Thursday', 'Friday', 'Saturday', 
                                      'Sunday']
        
        return days_of_week[day_selected.getDay()]  
    }

    function get_month_abbreviation():string {
        let month_abbreviations: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 
                                             'May', 'Jun', 'Jul', 'Aug', 
                                             'Sep', 'Oct', 'Nov', 'Dec']
        return month_abbreviations[day_selected.getMonth()]
    }

    function get_day_of_month(){
        return day_selected.getDate()
    }

    return (
        <div>
            <Day_Selection set_filter_date={get_day}/>
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
    },
    TimeSlotButton: {
        fontFamily: 'Poppins',
        fontWeight: '700',
        fontSize: '2.1vh',
        borderRadius: '10px',
        border: '0.6px solid #C0C0C0',
        backgroundColor: 'white',
        padding: '2vh 1.8vw',
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
    },
    SessionViewBox: {
        border: '0.7px solid #C0C0C0',
        borderRadius: '10px',
    },
    
})