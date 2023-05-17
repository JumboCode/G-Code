import React from 'react'
// import { Link } from 'react-router';
import Header from '../components/header'
import Link from 'next/link'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function BackButton({ href }) {
    return (
        <Link href={href}>
            <Button variant="secondary">
                <ArrowBackIcon />
            </Button>
        </Link>
    )
}
