import React from 'react'
import Header from './header'
import Sidebar from './sidebar'
import { Box, Drawer } from "@mui/material";
import "@fontsource/poppins";
import { DRAWER_WIDTH } from '../constants';

interface Props {
  window?: () => Window;
  availablePages: Array<string>
  currentPageTitle: string;
  user: {firstname: string}
}

export default function HeaderNav(props: Props) {

  const { window, availablePages, currentPageTitle } = props;
  const container = window !== undefined ? () => window().document.body : undefined;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    console.log("happens")
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
      <Header user={props.user} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          <Header user={props.user} handleDrawerToggle={handleDrawerToggle}/>
          <Sidebar availablePages={availablePages} currentPageTitle={currentPageTitle} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          <Header user={props.user} handleDrawerToggle={handleDrawerToggle}/>
          <Sidebar availablePages={availablePages} currentPageTitle={currentPageTitle} />
        </Drawer>
      </Box>
    </>
  )
}