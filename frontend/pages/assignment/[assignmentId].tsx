import axios from "axios";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });
import { useRouter } from "next/router";
import styles from "../../styles/Assignments.module.css";
import { Container } from "@mui/material";
import { Box } from "@mui/material";

export default function AssignmentDetails() {
  const router = useRouter();
  const { assignmentId } = router.query;
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/get_assignment_by_id", {
        params: {
          id_string: assignmentId,
        },
      })
      .then((res) => {
        // console.log(res.data);

        setAssignment(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  if (!assignment) {
    return <> Loading... </>;
  }

  const date = new Date(assignment.dueDate);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const nowDate = new Date("2023-01-29T01:00:00");
  // console.log(date.valueOf());
  // console.log(nowDate.valueOf());
  const timeRemaining = new Date(date.valueOf() - nowDate.valueOf());

  let hoursRemaing = 0;
  let minutesRemaining = 0;
  let secondsRemaining = 0;

  if (timeRemaining.valueOf() < 86400000) {
    hoursRemaing = timeRemaining.getHours();
    minutesRemaining = timeRemaining.getMinutes();
    secondsRemaining = timeRemaining.getSeconds();
    // console.log(hoursRemaing, minutesRemaining, secondsRemaining);
  }

  return (
    <div>
      <Grid container spacing={1.5} margin={1.5} padding={1.5}>
        <Grid item xs={8}>
          <div className={styles.title}> {assignment.name}</div>
          <div className={styles.timeRemaining}>Due date: {formattedDate}</div>
          {/* <div className={styles.timeRemaining}>
            Time remaining: {timeRemaining.toLocaleDateString("en-US", options)}
            : {hoursRemaing} hours
          </div> */}

          <div>
            <div className={styles.header}>Assignment Description</div>
            <div className={styles.descriptionText}>
              <Container sx={{ margin: "1rem" }}>
                {assignment.description}
              </Container>
            </div>
          </div>

          <div className={styles.header}>Assignment Feedback</div>
        </Grid>
        <Grid item xs={3} margin={1}>
          <Button variant="contained" fullWidth sx={{ margin: "1rem" }}>
            Submit
          </Button>
          <div className={styles.descriptionText}>
            <Container>
              <div className={styles.header}>Helpful Resources</div>
            </Container>
          </div>
          <div className={styles.header}>Commonly Asked Questions</div>
          <div className={styles.descriptionText}>
            <Container sx={{ margin: "1rem" }}>oh wow, text</Container>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

// function QuestionDetails({ question }) {
//   const [newReply, setNewReply] = React.useState("");

//   const submitReply = () => {
//     const reply_info = {
//       author_id: "temp",
//       body: newReply,
//       date: new Date(),
//     };

//     const question_reply = {
//       reply: reply_info,
//       question_name: question.title,
//     };

//     try {
//       axios.post(
//         "http://localhost:8000/api/respond_to_question",
//         question_reply
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <h2>{question.title}</h2>
//       {newReply}
//       <h2>{question.question}</h2>

//       <div>
//         <p>Replies</p>
//         {question.replies.map((reply) => reply.body)}
//       </div>

//       <Grid item xs={12}>
//         <ReactQuill
//           theme="snow"
//           value={newReply}
//           onChange={setNewReply}
//           modules={{
//             toolbar: [
//               ["bold", "italic", "underline"],
//               [{ list: "ordered" }, { list: "bullet" }],
//               ["link", "image"],
//             ],
//           }}
//           formats={[
//             "bold",
//             "italic",
//             "underline",
//             "list",
//             "bullet",
//             "indent",
//             "link",
//             "image",
//           ]}
//         />
//       </Grid>
//       <Button variant="primary" onClick={submitReply}>
//         {" "}
//         Post{" "}
//       </Button>
//     </div>
//   );

// export async function getStaticPaths() {
//   const res = await axios.get("http://localhost:8000/api/questions");
//   console.log("IN Get Static Paths");
//   const questions = await res.data;
//   console.log(questions);
//   const paths = questions.map((question) => ({
//     params: { title: question.title },
//   }));

//   return { paths, fallback: false };
// }

// export async function getStaticProps({ params }) {
//   const res = await axios.get("http://localhost:8000/api/one_question", {
//     params: {
//       field_name: "title",
//       field_value: params.title,
//     },
//   });

//   const question = await res.data;

//   return { props: { question } };
// }

// export default QuestionDetails;
