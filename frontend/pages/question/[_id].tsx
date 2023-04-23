import axios from "axios"
import React, { useState } from "react";
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"
const ReactQuill = dynamic(import('react-quill'), { ssr: false });



function QuestionDetails({ question }) {
  const [newReply, setNewReply] = React.useState("");

  const submitReply= () => {
    
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

    return (
      <div>
        <h2>{question.title}</h2>
        {newReply}
        <h2>{question.question}</h2>
        
        <div>
        <p>Replies</p>
        {question.replies.map( reply => reply.body)}
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
  
  export async function getStaticPaths() {
    const res = await axios.get("http://localhost:8000/api/questions")
    console.log("IN Get Static Paths")
    const questions = await res.data
    // console.log(questions)
    const paths = questions.map(question => ({
      // params: { title: question.title }
      params: { _id: question._id }
    }))
  
    return { paths, fallback: false }
  }
  
  export async function getStaticProps({ params }) {
    console.log("ID is")
    console.log(params)
    console.log("ID Finished")
    // const res = await axios.get("http://localhost:8000/api/one_question", {
    //     params: {
    //       field_name: '_id',
    //       field_value: params._id,
    //     },
    //   });



      const res = await axios.get("http://localhost:8000/api/get_question_by_id", {
        params: {
          id_string: params._id
        },
      });

      //  const res = await axios.get("http://localhost:8000/api/get_question_by_id", "6440140f3ecfbf9e89d2e9b1");


    const question = await res.data
    console.log("RESULT\n\n")
    console.log(question)
    console.log("Title: " + question.title)
  
    return { props: { question } }
  }
  
  export default QuestionDetails