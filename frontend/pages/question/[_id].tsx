import axios from "axios"
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"
const ReactQuill = dynamic(import('react-quill'), { ssr: false });
import { useRouter } from "next/router";



export default function QuestionDetails() {
  const router = useRouter()
  const { _id } = router.query
  const [question, setQuestion] = useState(null)
  console.log(_id)

  useEffect(() => {
    axios.get("http://localhost:8000/api/get_question_by_id", {
      params: {
        id_string: _id
      },
    }).then(res => {
      setQuestion(res.data)
    }).catch(error => {
      console.log(error)
    })
  })

  const [newReply, setNewReply] = React.useState("");

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

    try {
      axios.post('http://localhost:8000/api/respond_to_question', question_reply);
    } catch (error) {
      console.error(error);
    }
  }

  if (!question) {
    return <>Loading...</>
  }

  return (
    <div>
      <h2>{question.title}</h2>
      {newReply}
      <h2>{question.question}</h2>

      <div>
        <p>Replies</p>
        {question.replies.map(reply => reply.body)}
      </div>


      <Grid item xs={12}>
        <ReactQuill
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
      </Grid>
      <Button
        variant="primary"
        onClick={submitReply}
      >
        {" "}
        Post{" "}
      </Button>

    </div>
  )
}