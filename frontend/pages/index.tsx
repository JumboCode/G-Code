import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import React from 'react';
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import Footer from '../components/footer'


export default function Home() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <Header />
      <Footer />
    </div>
  )
}
