import React from "react";

// mui imports
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import HeaderNav from '../headernav';
import { ThemeProvider } from '@mui/material/styles';

// constants
import { DRAWER_WIDTH } from "../../constants";
import { theme } from '../../theme'

// styles
import styles from '../../styles/Home.module.css'

export default function AdminDashboard(props) {
    const user = props.user
    return (
        <ThemeProvider theme={theme}>
            <Box className={styles.content} sx={{ display: 'flex' }}>
                <CssBaseline />
                <HeaderNav user={{ firstname: user.firstname }} currentPageTitle="Dashboard Admin" />
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
                >
                    <Box style={{paddingTop: "50px"}}>
                        Admin Dashboard – not implemented
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
