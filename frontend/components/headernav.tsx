import React from 'react'
import Header from './header'
import Sidebar from './sidebar'
import { Box, Drawer } from "@mui/material";
import "@fontsource/poppins";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
  currentPageTitle: string;
}

export default function HeaderNav(props: Props) {
  const { window, currentPageTitle } = props;
  const container = window !== undefined ? () => window().document.body : undefined;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <>
      <style jsx global>{`
          body {
            background-color: #F9FAFB;
          }
        `}
      </style>
      <Header />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Header />
          <Sidebar currentPageTitle={currentPageTitle} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <Header />
          <Sidebar currentPageTitle={currentPageTitle} />
        </Drawer>
      </Box>
    </>
  )
}