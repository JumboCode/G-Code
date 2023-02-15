import React from "react";
import { Grid, Box, CssBaseline} from "@mui/material";
import HeaderNav from '../components/headernav.tsx';
import styles from "../styles/Home.module.css";
import { DRAWER_WIDTH } from "../constants";


export default function People() {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <HeaderNav currentPageTitle="FAQ Board"/>

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
        >
          <Grid sx={{paddingTop: '50px'}} container spacing={2}>
            <Grid item xs={8}>
              <p> title + search component </p>
            </Grid>
            <Grid item xs={4}>
              <p> filler </p>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <p> questions list </p>
            </Grid>
            <Grid item xs={4}>
              <p> help panel </p>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>

  );
}
