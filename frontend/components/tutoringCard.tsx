import React from "react";
import { useState } from "react";
import dashboardStyles from "../styles/Dashboard.module.css";
import { Grid, Button } from '@mui/material'
import { CalendarToday, AccessTime } from "@mui/icons-material";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import { getSessions, getUserEmailMap, handleCancel } from "../api/routes";

const steps = [
  {
    label: 'Cancel Appointment',
    description: `Would you like to cancel your appointment?`,
  },
  {
    label: 'Reschedule',
    description:
      'Would you like to reschedule?',
  },
];

function TutoringCard({tutor, student, date, time, id}) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setOpen(!open);
    setActiveStep(0);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      {open && (
        <div
          style={{ position: 'relative' }}
          className="modal fade"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <Box sx={{ Width: 400, zIndex: 2, position: "fixed", backgroundColor: "white", left: "45%", border: "3px solid #999999" }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    optional={
                      index === 2 ? (
                        <Typography variant="caption">Last step</Typography>
                      ) : null
                    }
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography>{step.description}</Typography>
                    <Box sx={{ mb: 2 }}>
                      <div>
                        {index == 0 &&
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Yes
                          </Button>
                        }
                        {index == 1 &&
                          <Button
                            variant="contained"
                            onClick={() => {
                              router.push('/OfficeHours')
                            }}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Yes
                          </Button>
                        }
                        <Button
                          onClick={() => handleCancel(id, handleBack)} sx={{ mt: 1, mr: 1 }}>
                          No
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>All steps completed - you&apos;re finished</Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </Box>
        </div>
      )}
      <Grid container spacing={2}>
        <Grid item lg={8} md={12}>
          <div className={dashboardStyles.tutoringSessionImage}>
            <div style={{ minWidth: '75px' }}>
              <Avatar sx={{ width: '75px', height: '75px', bgcolor: 'green' }} />
            </div>
            <div className={dashboardStyles.tutoringSessionTextDetails}>
              <div className={dashboardStyles.tutoringSessionName}>Office Hours with {tutor.firstname} {tutor.lastname} and {student.firstname} {student.lastname}</div>

              <div className={dashboardStyles.tutoringSessionLogistics}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginBottom: '5px' }}>
                  <CalendarToday sx={{ marginRight: '10px' }} /> {date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                  <AccessTime sx={{ marginRight: '10px' }} /> {time}
                </div>
              </div>
            </div>
          </div>

        </Grid>
        <Grid item lg={4} md={12}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'right',
            flexDirection: 'row',
            height: '100%'
          }}>
            <a target="_blank" rel="noreferrer" href={'https://' + tutor.zoom}>
              <Button variant="primary" sx={{ margin: "0 5px 0 5px" }}> Join </Button>
            </a>
            <Button onClick={() => setOpen(!open)} variant="text" sx={{ margin: "0 5px 0 5ipx" }}> Manage </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default function TutoringCardDisplay() {
  const [sessions, setSessions] = useState([]);
  const [userEmailMap, setUserEmailMap] = useState({})

  useEffect(() => {
    getSessions(setSessions)
    getUserEmailMap(setUserEmailMap)
  }, []);

  return (
    <div>
      {sessions.length > 0 ? (
        sessions.map((session) => {
          const startTime = new Date(session.startTime);
          const endTime = new Date(session.endTime);
          const date = new Date(session.startTime);

          const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = date.toLocaleDateString('en-US', options);

          return (
            <TutoringCard
              tutor={userEmailMap[session.tutorEmail]}
              student={userEmailMap[session.studentEmail]}
              date={formattedDate}
              time={`${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`}
              id={session._id}
              key={session.name}
            />
          );
        })
      ) : (
        <>
          <Box sx={{ height: "10%" }}>
            <Typography>
              No upcoming tutoring sessions
            </Typography>
          </Box>
        </>
      )}
    </div>
  );
}