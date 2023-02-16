import React from "react";
import { Grid, Box, CssBaseline } from "@mui/material";
import HeaderNav from '../components/headernav.tsx';
import styles from "../styles/Home.module.css";
import { DRAWER_WIDTH } from "../constants";
import { theme } from '../theme.ts'
import { List, ListItem, Avatar, ListItemAvatar, ListItemText, Divider, Typography, ThemeProvider, Card } from '@mui/material'


export default function FAQBoard() {

  const questions = [
    {
      author: "Michelle Minns",
      authorType: "Instructor",
      title: "Tips for connecting to database while using PHP",
      numReplies: 4,
      date: "Nov 21",
      time: "3:30 PM",
      pinned: false
    },
    {
      author: "Theseus Lim",
      authorType: "Student",
      title: "How do I center a DIV???",
      numReplies: 2,
      date: "Nov 22",
      time: "4:20 PM",
      pinned: false
    },
    {
      author: "Joe Speed",
      authorType: "Student",
      title: "Who is Shark Meldon???",
      numReplies: 1,
      date: "Nov 22",
      time: "4:20 PM",
      pinned: false
    },
    {
      author: "Sam Smith",
      authorType: "Student",
      title: "What is an array?",
      numReplies: 0,
      date: "Nov 22",
      time: "4:20 PM",
      pinned: false
    },
    {
      author: "Joe Speed",
      authorType: "Student",
      title: "Are we living in a simulation?",
      numReplies: 2,
      date: "Nov 22",
      time: "4:20 PM",
      pinned: false
    },
  ]

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <HeaderNav currentPageTitle="FAQ Board" />

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
        >
          <Grid sx={{ paddingTop: '50px' }} container spacing={2}>
            <Grid item xs={8}>
              <Box sx={{ padding: "40px 0 30px 0" }}>
                <Typography variant="h1">
                  Community Forum
                </Typography>
                <Typography variant="subtitle1">
                  Ask a question or help out your fellow classmates!
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              {/* Filler */}
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Card sx={{ borderRadius: '10px' }}>
                <List sx={{ width: '100%', bgcolor: 'white', borderRadius: "", padding: '0 20px 20px 20px' }}>
                  {questions.map(question =>
                    <>
                      <ListItem sx={{ padding: '40px 20px 40px 20px' }}>
                        <ListItemAvatar sx={{ width: '70px' }}>
                          <Avatar sx={{ height: '50px', width: '50px' }} src="sharkMeldon.png" />
                        </ListItemAvatar>
                        <ListItemText style={{ cursor: 'pointer' }}>
                          <Typography variant="subtitle2">
                            {question.authorType} · {question.author} · {question.date} · {question.time}
                          </Typography>
                          <Typography variant="h4">
                            {question.title}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: "400" }} >
                            {question.numReplies} {question.numReplies == 1 ? "reply" : "replies"}
                          </Typography>
                        </ListItemText>
                      </ListItem>
                      <Divider component="li" />
                    </>
                  )}
                </List>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <p> help panel </p>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>

  );
}
