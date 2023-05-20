import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"
const ReactQuill = dynamic(import('react-quill'), { ssr: false });
import { useRouter } from "next/router";
import { Avatar, Typography } from "@mui/material";
import Link from "next/link";
import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";
import "@fontsource/inter";
import BackButton from '../../components/backButton'
import { getQuestion, getUserMap, submitReply } from "../../api/routes";

const MessageCard = ({ author, body, type }) => {
    return (
        <Grid sx={{ marginBottom: '20px', }} container spacing={2}>
            <Grid item xs={3} md={2}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100%' }}>
                    <div>
                        <Avatar alt={author ? author.firstname : 'U'} sx={{ width: 40, height: 40 }} src="/static/images/avatar/2.jpg" sizes="large" />
                    </div>
                    <div
                        style={{
                            fontFamily: 'Inter',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            fontSize: '14px',
                            marginTop: '10px',
                            color: '#29395B',
                            textAlign: 'center'
                        }}
                    >
                        {author ? author.firstname + ' ' + author.lastname : 'author removed'}
                    </div>
                    <div>
                        {author &&
                            <Link href={'/People/' + author._id}>
                                <Button variant="profile">Profile</Button>
                            </Link>}
                    </div>
                </div>
            </Grid>
            <Grid item xs={9} md={10}>
                <Card
                    sx={{
                        background: '#FFFFFF',
                        boxShadow: '2px 2px 10px 2px rgba(142, 142, 142, 0.2)',
                        backdropFilter: 'blur(30px)',
                        borderRadius: '12px'
                    }}
                >
                    <CardContent>
                        <p style={{ color: '#6A5DF9', fontWeight: 'bold' }}>{type}</p>
                        <div dangerouslySetInnerHTML={{ __html: body }} />
                    </CardContent>
                </Card>
            </Grid>
        </Grid >
    )
}

export default function IndividualQuestion({ user, question_id }) {
    const router = useRouter()

    const [question, setQuestion] = useState(null)
    const [users, setUsers] = useState(null)
    const [newReply, setNewReply] = React.useState("");



    const handleSubmitReply = () => {
        submitReply(question_id, newReply)
            .then(() => {
                getQuestion(question_id, setQuestion)
                getUserMap(setUsers)
            })
    }

    useEffect(() => {
        getQuestion(question_id, setQuestion)
        getUserMap(setUsers)
    }, [question_id])

    if (!question || !user || !users) {
        return <>Loading...</>
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={10}>
                <div style={{ marginBottom: '20px' }}>
                    <BackButton href="/FAQBoard" />
                </div>

                <Typography variant="subtitle1">
                    Last updated on Nov 21 • 3:30 PM
                </Typography>
                <h2>{question.title}</h2>
                <MessageCard author={question.author_id in users ? users[question.author_id] : null} body={question.body} type='Question' />
                {question.replies.map((reply, idx) => <MessageCard key={idx} author={users[reply.author_id]} body={reply.body} type='Response' />)}
                <div>
                    <p style={{ fontWeight: 'bold' }}>Reply</p>
                </div>
                <ReactQuill
                    style={{ backgroundColor: 'white' }}
                    theme="snow"
                    value={newReply}
                    onChange={setNewReply}

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
                <div>
                    <Button
                        sx={{ marginTop: '20px' }}
                        variant="primary"
                        onClick={() => {handleSubmitReply()}}
                    >
                        Post
                    </Button>
                </div>

            </Grid>
        </Grid>
    )
}