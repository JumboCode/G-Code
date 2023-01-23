import React from "react";
import { Box, CssBaseline} from "@mui/material";
import HeaderNav from '../components/headernav.tsx';


export default function Home() {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <HeaderNav />

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
        >
          
        </Box>
      </Box>
    </>
  );
}
