import React from "react";
import { useState } from "react";
import dashboardStyles from "../styles/Dashboard.module.css";
import { Grid, Button } from '@mui/material'
import { CalendarToday, AccessTime } from "@mui/icons-material";
import Image from "next/image";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useEffect } from "react";
import axios from "axios";


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

function TutoringCard({
  name,
  date,
  time,
}: {
  name: string;
  date: string;
  time: string;
}) {
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
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
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
      <Grid container spacing={2} className={dashboardStyles.tutoringSessionCard}>
        <Grid item lg={8} md={12}>
          <div className={dashboardStyles.tutoringSessionImage}>
            <Image
              src="/sharkMeldon.png"
              alt="Shark Meldon Incarnate"
              width={75}
              height={75}
              style={{ borderRadius: "100pc", overflow: "hidden" }}
            />
          </div>

          <div className={dashboardStyles.tutoringSessionTextDetails}>
            <div className={dashboardStyles.tutoringSessionName}>{name}</div>

            <div className={dashboardStyles.tutoringSessionLogistics}>
              <CalendarToday />
              <div className={dashboardStyles.tutoringSessionDate}>{date}</div>
              <AccessTime />
              <div className={dashboardStyles.tutoringSessionTime}>{time}</div>
            </div>
          </div>
        </Grid>
        <Grid item lg={4} md={12}>
          <div style={{ float: "right" }}>
            <a target="_blank" rel="noreferrer" href="https://tufts.zoom.us/j/2899137562?pwd=alJ6Q3RScWN6WkYwL1R1OS9wN1I1dz09">
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

  useEffect(() => {
    axios.get("http://localhost:8000/api/appointments3", {
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        setSessions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      {sessions.length > 0 ? (
        sessions.map((session) => {
          const startTime = new Date(session.startTime);
          const endTime = new Date(session.endTime);
          const date = new Date(session.date);

          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = date.toLocaleDateString('en-US', options);

          return (
            <TutoringCard
              name={session.name}
              date={formattedDate}
              time={`${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`}
            />
          );
        })
      ) : (
        "No upcoming tutoring sessions"
      )}
    </div>
  );
}