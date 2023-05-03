import axios from "axios"
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"
const ReactQuill = dynamic(import('react-quill'), { ssr: false });
import { useRouter } from "next/router";
import IsUserAuthorized from "../../components/authentification";
import Margin from "../../components/margin";
import { student_pages, admin_pages } from '../../constants'
import { Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";
import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";

const MessageCard = ({ body, type }) => {
  return (
    <Card
      sx={{
        marginBottom: '20px',
        background: '#FFFFFF',
        boxShadow: '2px 2px 10px 2px rgba(142, 142, 142, 0.2)',
        backdropFilter: 'blur(30px)',
        /* Note: backdrop-filter has minimal browser support */
        borderRadius: '12px'
      }}
    >
      <CardContent>
        <p style={{ color: '#6A5DF9', fontWeight: 'bold' }}>{type}</p>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </CardContent>
    </Card>
  )
}

export default function QuestionDetails() {
  const router = useRouter()
  const { _id } = router.query
  const [question, setQuestion] = useState(null)

  const [user, setUser] = useState(null);
  const save_user = curr_user => {
    if (user == null) {
      setUser(curr_user)
    }
  }
  /* Authorize user and return user 
   * information (ex. first name, username, ect.) */
  IsUserAuthorized(save_user)

  const [newReply, setNewReply] = React.useState("");

  const updateQuestion = () => {
    axios.get("http://localhost:8000/api/get_question_by_id", {
      params: {
        id_string: _id
      },
    }).then(res => {
      setQuestion(res.data)
    }).catch(error => {
      console.log(error)
    })
  }

  const submitReply = () => {
    const reply_info = {
      author_id: "temp",
      body: newReply,
      date: new Date()
    };
    const question_reply = {
      reply: reply_info,
      question_name: question.title
    }
    axios.post('http://localhost:8000/api/respond_to_question', question_reply)
    .then(_ => {
      updateQuestion()
      setNewReply("")
    }).catch(error => {
      console.error(error);
    })
  }

  useEffect(() => {
    updateQuestion()
  }, [])

  if (!question || !user) {
    return <>Loading...</>
  }


  return (
    <Margin
      user={user}
      availablePages={user.type == 'admin' ? admin_pages : student_pages}
      currentPageTitle={'FAQBoard'}
    >
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <div style={{marginBottom: '20px'}}>
            <Link href="../FAQBoard">
              <Button variant="secondary">
                <ArrowBackIcon />
              </Button>
            </Link>
          </div>

          <Typography variant="subtitle1">
            Last updated on Nov 21 • 3:30 PM
          </Typography>
          <h2>{question.title}</h2>
          <MessageCard body={question.question} type='Question' />
          {question.replies.map(reply => <MessageCard body={reply.body} type='Response' />)}
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
              onClick={() => {
                submitReply()
              }}
            >
              Post
            </Button>
          </div>

        </Grid>
      </Grid>
    </Margin >




  )
}