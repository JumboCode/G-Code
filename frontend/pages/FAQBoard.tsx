import React from "react";
import { Grid, Box, CssBaseline} from "@mui/material";
import HeaderNav from '../components/headernav.tsx';
import dashboardStyles from "../styles/Dashboard.module.css";

const drawerWidth = 240;

export default function People() {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <HeaderNav currentPageTitle="FAQ Board"/>

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Grid container spacing={2}>
            <Grid className={dashboardStyles.header1} item xs={12}>
              <p> Questions! </p>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>

  );
}
