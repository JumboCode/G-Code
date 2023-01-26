import React from "react";
import { Grid, Box, CssBaseline} from "@mui/material";
import HeaderNav from '../components/headernav.tsx';

import dashboardStyles from "../styles/Dashboard.module.css";
import TutoringCardDisplay from "../components/tutoringCard";

const drawerWidth = 240;

export default function Dashboard() {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <HeaderNav />

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Grid container spacing={2}>
            <Grid className={dashboardStyles.header1} item xs={12}>
              <p> Title </p>
            </Grid>
            <Grid item sm={12} md={7}>
              Column 1
            </Grid>
            <Grid item sm={12} md={5}>
              Column 2
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>

  );
}
