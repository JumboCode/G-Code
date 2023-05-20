import React from "react";
import { Grid, Box, Select, List, ListItem, Avatar, ListItemAvatar, ListItemText, Divider, Typography, Card, Paper, IconButton, InputBase, Button, Modal, TextField, InputLabel, MenuItem, FormControl } from "@mui/material"

// components
import CustomSelect from "../customSelect";

// icons
import SearchIcon from "@mui/icons-material/Search";
import EastIcon from "@mui/icons-material/East";

// requests
import axios from "axios"

// styling
import "react-quill/dist/quill.snow.css";

// other
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import Link from 'next/link'
import Cookies from 'js-cookie'
import IndividualQuestion from "./IndividualQuestion";

import { getQuestions, getUserMap, postQuestion } from "../../api/routes";

const emptyQuestion = { title: '', body: '' }

const ReactQuill = dynamic(import('react-quill'), { ssr: false });

const modal_style = {
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

export default function GeneralFAQBoard({ user, question_id }) {
    const router = useRouter();
    const [questions, setQuestions] = React.useState(null);
    const [users, setUsers] = React.useState(null);
    const [onlyMyQuestions, setOnlyMyQuestions] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [question, setQuestion] = React.useState(emptyQuestion)
    const [formValid, setFormValid] = React.useState(true);

    React.useEffect(() => {
        updateQuestions()
        updateUsers()
    }, []);

    if (question_id) {
        return <IndividualQuestion user={user} question_id={question_id} />
    }

    const updateQuestions = () => {
        getQuestions(setQuestions)
    }

    const updateUsers = () => {
        getUserMap(setUsers)
    }

    // ask question modal
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // add question
    const submitQuestion = () => {
        const valid = validateTitle(question.title) && validateQuestion(question.body);
        setFormValid(valid);

        if (valid) {
            postQuestion(question)
            setQuestion(emptyQuestion)
            handleClose();
        }
    };

    // validation
    const validateTitle = (title: string) => { return title != ""; };
    const validateQuestion = (question: string) => { return question != ""; };

    const handleChange = (e) => {
        setQuestion({
            ...question,
            [e.target.name]: e.target.value
        })
    }

    if (!questions || !users) {
        return <></>
    }

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modal_style}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    id="outlined-basic"
                                    label="Title"
                                    variant="outlined"
                                    name="title"
                                    value={question.title}
                                    onChange={handleChange}
                                    error={!formValid && !validateTitle(question.title)}
                                    helperText={
                                        !formValid &&
                                        !validateTitle(question.title) &&
                                        "Please enter a title"
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <ReactQuill
                                theme="snow"
                                value={question.title}
                                onChange={handleChange}
                                modules={{
                                    toolbar: [
                                        ["bold", "italic", "underline"],
                                        [
                                            { list: "ordered" },
                                            { list: "bullet" },
                                        ],
                                        ["link", "image"],
                                    ],
                                }}
                                formats={[
                                    "bold",
                                    "italic",
                                    "underline",
                                    "list",
                                    "bullet",
                                    "indent",
                                    "link",
                                    "image",
                                ]}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <Button
                                    variant='secondary'
                                    onClick={handleClose}
                                >
                                    {" "}
                                    Cancel{" "}
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <Button
                                    variant="primary"
                                    onClick={submitQuestion}
                                >
                                    {" "}
                                    Submit{" "}
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
            <Grid container spacing={2}>
                <Grid item md={9} xs={12}>
                    <Box className="headerBox">
                        <Grid container>
                            <Grid item xs={8}>
                                <Typography variant="h1">
                                    Community Forum
                                </Typography>
                                <Typography variant="subtitle1">
                                    Ask a question or help out your
                                    fellow classmates!
                                </Typography>

                            </Grid>
                            <Grid item xs={4}>
                                {/* <Button
                                    sx={{ margin: "10px" }}
                                    variant="secondary"
                                    onClick={() => setOnlyMyQuestions(!onlyMyQuestions)}
                                >
                                    {onlyMyQuestions ? "All Questions" : "My Questions"}

                                </Button> */}
                                <Box sx={{display: 'flex', justifyContent: 'right', alignItems: 'center'}}>
                                    <Button
                                        onClick={handleOpen}
                                        variant="primary"
                                    >
                                        Ask a Question
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item md={3} xs={0}>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item md={9} xs={12}>
                    <Card sx={{ borderRadius: '10px' }}>

                        <List sx={{ padding: '0 20px 20px 20px' }}>
                            {questions.map(question =>
                                <>
                                    <Link href={`/FAQBoard/${question._id}`}>
                                        <ListItem sx={{ padding: '40px 20px 40px 20px' }}>
                                            <ListItemAvatar sx={{ width: '70px' }}>
                                                <Avatar sx={{ height: '50px', width: '50px' }}> {question.author_id in users ? users[question.author_id]['firstname'][0] : 'U'} </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText style={{ cursor: 'pointer' }}>
                                                <Typography variant="subtitle2">
                                                    {question.author_id in users ? users[question.author_id]['firstname'] : 'author removed'} · {question.date.toDateString()} · {question.date.toLocaleTimeString()}
                                                </Typography>
                                                <Typography variant="h4">
                                                    {question.title}
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ fontWeight: "400" }} >
                                                    {question.replies.length} {question.replies.length == 1 ? "reply" : "replies"}
                                                </Typography>
                                            </ListItemText>
                                        </ListItem>
                                    </Link>
                                    <Divider component="li" />
                                </>
                            )}
                        </List>
                    </Card>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Box>
                        <Typography variant="h3">
                            Still Confused?
                        </Typography>
                        <Box sx={{ marginTop: '15px' }}>
                            <Button variant="secondary" onClick={() => {
                                router.push('/OfficeHours')
                            }} sx={{ "width": "100%" }}>
                                Sign Up For Office Hours <EastIcon />
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
