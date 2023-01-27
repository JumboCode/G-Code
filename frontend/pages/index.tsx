import React from "react";
import axios from "axios";

export default function Home() {

  React.useEffect(() => {
    axios.get('http://localhost:8000/api/students')
      .then(res => {
        console.log(res)
      })
  }, []);


  return (
    <>
      <a href="./Dashboard"> go to dashboard </a>
    </>
  );
}
