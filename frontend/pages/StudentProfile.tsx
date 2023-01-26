import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dashboardStyles from "../styles/Dashboard.module.css";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function studentProfile() {
    const [currentstudent, setStudent] = useState('');

    useEffect(() => {
      axios
        .get("http://localhost:8000/api/student")
        .then(response => {
            console.log(response)
            setStudent(response.data)
        }
        )
        .catch((err) => console.log(err));
    }, []);

    return (
      <div>
        <p> firstname: </p>
        <p>{currentstudent}</p>
      </div>
    );
}









