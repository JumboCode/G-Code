import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import React from 'react';

export default function Home() {
  return (
    <div className={styles.container}>
      <p> Hello, World! </p>
    </div>
  )
}
