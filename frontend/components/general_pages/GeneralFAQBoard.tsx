import React, { useState } from "react";
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
    if (question_id) {
        return <IndividualQuestion user={user} question_id={question_id} />
    }
    // create and get questiosn from backend
    const [questions, setQuestions] = React.useState(null);
    const [users, setUsers] = React.useState(null);

    const updateQuestions = () => {
        axios.get("http://localhost:8000/api/questions").then((res) => {
            setQuestions(
                res.data.map(question => {
                    return {
                        ...question,
                        date: new Date(Date.parse(question.date)),
                    }
                })
            );
        });
    }

    const updateUsers = () => {
        axios.get("http://localhost:8000/api/users").then((res) => {
            let users_map = {}
            for (const user_idx in res.data) {
                const user = res.data[user_idx]
                users_map[user._id] = user
            }
            setUsers(users_map)
        })
    }

    React.useEffect(() => {
        updateQuestions()
        updateUsers()
    }, []);


    const [onlyMyQuestions, setOnlyMyQuestions] = React.useState(false);

    // ask question modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [modalTitle, setModalTitle] = React.useState("");
    const [modalTopic, setModalTopic] = React.useState("General");
    const [rteValue, setRteValue] = React.useState("");

    // add question
    const submitQuestion = () => {
        const valid = validateTitle(modalTitle) && validateQuestion(rteValue);
        setFormValid(valid);

        if (valid) {
            const token = Cookies.get('gcode-session');
            const data = {
                title: modalTitle,
                body: rteValue,
            };
            const config = {
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            };
            axios.post('http://localhost:8000/api/create_post', data, config).then(() => { updateQuestions() })

            setModalTitle("");
            setModalTopic("General");
            setRteValue("");
            handleClose();
        }
    };

    // validation
    const [formValid, setFormValid] = React.useState(true);
    const validateTitle = (title: string) => { return title != ""; };
    const validateQuestion = (question: string) => { return question != ""; };

    // validation
    const router = useRouter();

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
                        <Grid item xs={8}>
                            <FormControl fullWidth>
                                <TextField
                                    id="outlined-basic"
                                    label="Title"
                                    variant="outlined"
                                    value={modalTitle}
                                    onChange={(event) =>
                                        setModalTitle(event.target.value)
                                    }
                                    error={
                                        !formValid && !validateTitle(modalTitle)
                                    }
                                    helperText={
                                        !formValid &&
                                        !validateTitle(modalTitle) &&
                                        "Please enter a title"
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="modal-topic-select-label">
                                    Topic
                                </InputLabel>
                                <Select
                                    labelId="modal-topic-select-label"
                                    id="modal-topic-select"
                                    label="Topic"
                                    value={modalTopic}
                                    onChange={(event) =>
                                        setModalTopic(event.target.value)
                                    }
                                >
                                    <MenuItem value={"General"}>
                                        General
                                    </MenuItem>
                                    <MenuItem value={"Joe"}>Joe</MenuItem>
                                    <MenuItem value={"Theseus"}>
                                        Theseus
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <ReactQuill
                                theme="snow"
                                value={rteValue}
                                onChange={setRteValue}
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
                            <Grid item xs={12} md={8}>
                                    <Typography variant="h1">
                                        Community Forum
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        Ask a question or help out your
                                        fellow classmates!
                                    </Typography>

                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    sx={{ margin: "10px" }}
                                    variant="secondary"
                                    onClick={() => setOnlyMyQuestions(!onlyMyQuestions)}
                                >
                                    {onlyMyQuestions ? "All Questions" : "My Questions"}

                                </Button>
                                <Button
                                    onClick={handleOpen}
                                    variant="primary"
                                >
                                    Ask a Question
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    {/* <Box sx={{ paddingBottom: "20px" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={5}>
                                <Paper
                                    component="form"
                                    sx={{
                                        p: "2px 4px",
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%",
                                        borderRadius: "10px",
                                        border: "1px solid rgba(0, 0, 0, 0.23)",
                                        boxShadow: "0",
                                    }}
                                >
                                    <IconButton
                                        sx={{
                                            p: "10px",
                                            color: "#6A5DF9",
                                        }}
                                        aria-label="menu"
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Search"
                                        inputProps={{
                                            "aria-label": "search",
                                        }}
                                        value={searchQuery}
                                        onChange={(event) =>
                                            setSearchQuery(
                                                event.target.value
                                            )
                                        }
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <CustomSelect
                                    value={week}
                                    handleChange={(event) => {
                                        setWeek(event.target.value);
                                    }}
                                    choices={weeks}
                                />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <CustomSelect
                                    value={topic}
                                    handleChange={(event) => {
                                        setTopic(event.target.value);
                                    }}
                                    choices={topics}
                                />
                            </Grid>
                        </Grid>
                    </Box> */}
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
