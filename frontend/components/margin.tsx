import React from "react";

// mui imports
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from '@mui/material/styles';

// constants
import HeaderNav from './headernav';
import { DRAWER_WIDTH } from "../constants";
import { theme } from '../theme'

// styles
import styles from '../styles/Home.module.css'

export default function Margin({ user, availablePages, currentPageTitle, children }) {

    return (
        <ThemeProvider theme={theme}>
            <Box className={styles.content} sx={{ display: 'flex' }}>
                <CssBaseline />
                <HeaderNav 
                    user={{ firstname: user.firstname }} 
                    availablePages={availablePages} 
                    currentPageTitle={currentPageTitle} 
                />
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
                >
                    <Box style={{paddingTop: "50px"}}>
                        {children}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
