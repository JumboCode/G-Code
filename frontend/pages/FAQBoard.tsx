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
          <Grid container spacing={2}>
            <Grid className={styles.header1} item xs={12}>
              <p> Questions! </p>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>

  );
}
