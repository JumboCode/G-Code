import React, { useState, useRef, useMemo } from "react";
import { Grid, Box, CssBaseline, Select } from "@mui/material";
import HeaderNav from "../components/headernav.tsx";
import { DRAWER_WIDTH } from "../constants";
import { theme } from "../theme.ts";
import {
    List,
    ListItem,
    Avatar,
    ListItemAvatar,
    ListItemText,
    Divider,
    Typography,
    ThemeProvider,
    Card,
    Paper,
    IconButton,
    InputBase,
    Button,
    Modal,
    TextField,
    InputLabel,
    MenuItem,
    FormControl,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CommunityResourcesPanel from "../components/communityResourcesPanel";
import EastIcon from "@mui/icons-material/East";
import CustomSelect from "../components/customSelect";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";


const ReactQuill = dynamic(import('react-quill'), { ssr: false });

export default function FAQBoard() {
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

    const [questions, setQuestions] = React.useState([]);

    React.useEffect(() => {
        axios.get("http://localhost:8000/api/questions").then((res) => {
            setQuestions(
                res.data.map((question) => {
                    return {
                        ...question,
                        date: new Date(Date.parse(question.date)),
                    };
                })
            );
        });
    }, []);

    const weeks = ["All Weeks"].concat(
        Array.from(
            new Set(questions.map((question) => `Week ${question.week}`))
        )
    );
    const [week, setWeek] = React.useState<string>(weeks[0]);

    const topics = ["All Topics"].concat(
        Array.from(
            new Set(
                questions.reduceRight(
                    (accumulator, question) =>
                        accumulator.concat(question.topics),
                    []
                )
            )
        )
    );
    const [topic, setTopic] = React.useState<string>("All Topics");

    const [searchQuery, setSearchQuery] = React.useState<string>("");

    // Filter functions
    const filterWeek = (question) => {
        return week == "All Weeks" || week == `Week ${question.week}`;
    };

    const filterTopic = (question) => {
        return topic == "All Topics" || question.topics.includes(topic);
    };

    const filterSearch = (question) => {
        return (
            searchQuery == "" ||
            JSON.stringify(question)
                .toUpperCase()
                .includes(searchQuery.toUpperCase())
        );
    };

    // modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [modalTitle, setModalTitle] = React.useState("");
    const [modalTopic, setModalTopic] = React.useState("General");
    const [modalQuestion, setModalQuestion] = React.useState("");

    // add question
    const submitQuestion = () => {
        const valid =
            validateTitle(modalTitle) && validateQuestion(modalQuestion);
        setFormValid(valid);
        if (valid) {
            console.log(
                `title: ${modalTitle}, topic: ${modalTopic}, question: ${modalQuestion}`
            );
            setModalTitle("");
            setModalTopic("General");
            setModalQuestion("");
            handleClose();
        }
    };

    // validation
    const [formValid, setFormValid] = React.useState(true);
    const validateTitle = (title: string) => {
        return title != "";
    };
    const validateQuestion = (question: string) => {
        return question != "";
    };

    // rich text editor
    const [rteValue, setRteValue] = React.useState("");

    return (
        <ThemeProvider theme={theme}>
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
                                    variant="secondary"
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
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <HeaderNav currentPageTitle="FAQ Board" />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
                    }}
                >
                    <Grid sx={{ paddingTop: "50px" }} container spacing={2}>
                        <Grid item md={9} xs={12}>
                            <Box sx={{ padding: "40px 0 30px 0" }}>
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
                                        >
                                            My Questions
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
                            <Box sx={{ paddingBottom: "20px" }}>
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
                            </Box>
                        </Grid>
                        <Grid item md={3} xs={0}>
                            {/* Filler */}
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item md={9} xs={12}>
                            <Card sx={{ borderRadius: "10px" }}>
                                <List sx={{ padding: "0 20px 20px 20px" }}>
                                    {questions
                                        .filter(filterWeek)
                                        .filter(filterTopic)
                                        .filter(filterSearch)
                                        .map((question) => (
                                            <>
                                                <ListItem
                                                    sx={{
                                                        padding:
                                                            "40px 20px 40px 20px",
                                                    }}
                                                >
                                                    <ListItemAvatar
                                                        sx={{ width: "70px" }}
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                height: "50px",
                                                                width: "50px",
                                                            }}
                                                        >
                                                            {" "}
                                                            {
                                                                question.author.split(
                                                                    " "
                                                                )[0][0]
                                                            }
                                                            {
                                                                question.author.split(
                                                                    " "
                                                                )[1][0]
                                                            }{" "}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <Typography variant="subtitle2">
                                                            {question.author} ·{" "}
                                                            {question.date.toDateString()}{" "}
                                                            ·{" "}
                                                            {question.date.toLocaleTimeString()}
                                                        </Typography>
                                                        <Typography variant="h4">
                                                            {question.title}
                                                        </Typography>
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{
                                                                fontWeight:
                                                                    "400",
                                                            }}
                                                        >
                                                            {
                                                                question.numreplies
                                                            }{" "}
                                                            {question.numreplies ==
                                                            1
                                                                ? "reply"
                                                                : "replies"}
                                                        </Typography>
                                                    </ListItemText>
                                                </ListItem>
                                                <Divider component="li" />
                                            </>
                                        ))}
                                </List>
                            </Card>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <Box>
                                <Typography variant="h3">
                                    Still Confused?
                                </Typography>
                                <Box sx={{ marginTop: "15px" }}>
                                    <Button
                                        variant="secondary"
                                        sx={{ width: "100%" }}
                                    >
                                        Go to Office Hours <EastIcon />
                                    </Button>
                                </Box>
                            </Box>
                            <Box>
                                <CommunityResourcesPanel />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
