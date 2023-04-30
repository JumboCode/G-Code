import React, { useState } from 'react';
import styles from '../../styles/Home.module.css'
import { Box, Grid, Typography, Button, Switch, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Select, FormControl, MenuItem} from "@mui/material"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import axios from "axios"

const button_style = { color: '#3D495C' };
const sessions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const timezones = ["Eastern", "Central", "Mountain", "Pacific"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const options = ['9:00 AM', '9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM', '12:00 PM',
'12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM',
'4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM', '9:00 PM'];
export default function AdminOfficeHours(props) {
    const user = props.user
    const [timeZone, setTimeZone] = React.useState("");
    const [maxSessions, setMaxSessions] = React.useState(0);
    const [times, setTimes] = React.useState([[],[],[]]);
    const [isDefault, setIsDefault] = React.useState(true);
    const [open, setOpen] = React.useState(false);

    const saveSchedule = () => {
      console.log("Calling saveSchedule")
      console.log("Email: " + user.email)
      console.log("Timezone: " + timeZone);
      console.log("Max Sessions: " + maxSessions);
      console.log("Default: " + isDefault);

      const schedule_info = {
        email: user.email,
        timezone: timeZone,
        maxsessions: maxSessions,
        times: times,
        default: isDefault,
      };
      axios.post('http://localhost:8000/api/save_schedule', schedule_info)
  };

    return (
    <>
    <ConfirmZero open={open} setOpen={setOpen} saveSchedule={saveSchedule} />

    {/* Header */}
          <Grid container xs={12}>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}> 
                <Typography fontSize="2rem" fontWeight="bold">
                  Office Hours Schedule
                </Typography>
              </Grid>
              <Grid item xs={4}></Grid>
            </Grid>

      <Grid container xs={12}>
{/* Left Side */}
        <Grid item xs={8}>
              <h2 style={{ ...tutoring_styles.SubHeading }}>
                  Current Availablility
              </h2>
            <TableContainer className={styles.pageElement} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                        {
                            days.map(day => (
                                <DayRow dayName={day} key={day} times={times} setTimes={setTimes} />
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
<Grid item xs={1}></Grid>
{ /* Right Side */}
        <Grid item xs={3}>
          <OptionsSidebar></OptionsSidebar>
        </Grid>
    </Grid>
    </>
    )


  
  function OptionsSidebar() {
      return (
        <>
            <Box>
              <Grid item xs={12} mb="10%"></Grid>
  
              <Typography variant="h3">
                Settings
              </Typography>
  
              <Grid item xs={12} mb="10%"></Grid>
  
              <Grid item xs={4}></Grid>
              <Grid item xs={8}>
                <Typography>
                  Time Zone
                </Typography>
                  <FormControl fullWidth>
                  <Select
                    value={timeZone}
                    displayEmpty
                    onChange={(event) => setTimeZone(event.target.value)}
                    sx={{
                      height: '30px',
                      fontFamily: 'Poppins',
                      backgroundColor: 'white'
                    }}
                  >
                  {timezones.map(option =>
                    <MenuItem value={option} key={option}>
                      {option}
                    </MenuItem>
                    )}
                  </Select>
                  </FormControl>

                <Grid item xs={4}></Grid>
  
                <Grid item xs={12} mb="20%"></Grid>
  
              <Typography>
                  Max # of Sessions / Week
                  <Typography color="#111111" fontSize=".7rem">
                  <p>Note: You can put in more times than this, this is just a cap on how many of those times can be reserved by students. Each session is 30 minutes.</p>
                  </Typography>
              </Typography>
              <FormControl fullWidth>
                  <Select
                    value={maxSessions}
                    displayEmpty
                    onChange={(event) => setMaxSessions(event.target.value as number)}
                    sx={{
                      height: '30px',
                      fontFamily: 'Poppins',
                      backgroundColor: 'white'
                    }}
                  >
                  {sessions.map(option =>
                    <MenuItem value={option} key={option}>
                      {option}
                    </MenuItem>
                    )}
                  </Select>
                  </FormControl>
  
                <Grid item xs={12} mb="20%"></Grid>

                <Typography>
                  Save as default schedule
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={isDefault}
                    displayEmpty
                    onChange={(event) => setIsDefault(event.target.value as boolean)}
                    sx={{
                      height: '30px',
                      fontFamily: 'Poppins',
                      backgroundColor: 'white'
                    }}
                  >
                    <MenuItem value="true" key="yes">Yes</MenuItem>
                    <MenuItem value="false" key="no">No</MenuItem>
                  </Select>
                  </FormControl>

                <Grid item xs={12} mb="20%"></Grid>
  
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    if (maxSessions == 0) {
                      setOpen(true)
                    } else {
                      saveSchedule();
                    }
                  }}
                >
                    Save Schedule
                </Button>
              </Grid>
            </Box>
          </>
      );
  }
}

function ConfirmZero({ open, setOpen, saveSchedule }) {
  const handleCloseYes = () => {
    setOpen(false);
    console.log("Yes")
    saveSchedule();
  };

  const handleCloseNo = () => {
    setOpen(false);
    console.log("No")
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCloseNo}
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to have 0 sessions per week?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNo}>No</Button>
          <Button onClick={handleCloseYes} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function DayRow({ dayName, times, setTimes }) {
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
                        dayName = {dayName}
                        setNumTimeIntervals={setNumTimeIntervals}
                        times = {times}
                        setTimes = {setTimes}
                        />
                )}
            </TableCell>
        </TableRow>
    );
}

function TimeIntervalSelector({ bottom, setNumTimeIntervals, dayName, times, setTimes }) {
    function update_start_time(time) {
      var times_copy = times


    }

    function update_end_time(time) {

    }

    return (
    <div style={tutoring_styles.TimeIntervalSelector}>
{/* START TIME*/}
      <FormControl fullWidth>
        <Select
          displayEmpty
          sx = {{
            height: "30px"
          }}
          onChange={(event) => update_start_time(event.target.value)}
        >
      {options.map(option =>
        <MenuItem value={option} key={option}>
          {option}
        </MenuItem>
      )}
        </Select>
      </FormControl>

        TO

{/* END TIME */}
      <FormControl fullWidth>
        <Select
          displayEmpty
          sx = {{
            height: "30px"
          }}
          onChange={(event) => update_end_time(event.target.value)}
        >
      {options.map(option =>
        <MenuItem value={option} key={option}>
          {option}
        </MenuItem>
      )}
        </Select>
      </FormControl>

{/* CREATE NEW ROW */}     
    {bottom && <>
      <IconButton onClick={() => setNumTimeIntervals((old) => old + 1)}>
          <AddRoundedIcon sx={button_style} />
      </IconButton>
      <IconButton onClick={() => {
          setNumTimeIntervals((old) => old - 1);
      }}>
          <DeleteOutlineOutlinedIcon sx={button_style} />
      </IconButton>
    </>}
  </div>)
}

const tutoring_styles = ({
    PageHeadingContainer:
    {
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
