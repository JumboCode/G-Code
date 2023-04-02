import styles from "../styles/Home.module.css";
import axios from 'axios';
import React from 'react';

export default function Home() {
  const [students, setStudents] = React.useState([{}])

  React.useEffect(() => {
    axios.get('http://localhost:8000/api/students')
      .then(res => {
        console.log(res)
        setStudents(res.data)
      })
  }, []);

  return (
    <div className={styles.container}>
      <h1>Students:</h1>
      {students.map((student, i) => <p key={i}>{student.firstname} {student.lastname}</p>)}
    </div>
  );
}

// export async function getServerSideProps(context) {
//   const res = await fetch("http://localhost:8000/api/students");
//   console.log(res)
//   const data = await res.json();
//   return {
//     props: { data }, // will be passed to the page component as props
//   }
// }
