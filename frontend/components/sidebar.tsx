import React from 'react';
import { useState } from 'react';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import PeopleIcon from '@mui/icons-material/People';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeIcon from '@mui/icons-material/Home';
import "@fontsource/poppins";
import { useRouter } from 'next/router';
import { Toolbar } from '@mui/material';

function SideBarElement({ text, active }) {
    const [isHover, setIsHover] = useState(false);
    const router = useRouter();
    return <div
        key={text}
        onClick={function () {
            router.push("/" + text)
        }}
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
        style={{
            ...styles.SidebarElement,
            backgroundColor: (active || isHover) ? '#F3F4F6'
                    : 'white',
            color: (active || isHover) ? '#6A5DF9'
                    : '#949494',
      }}>
      {text === "Dashboard" && <GridViewRoundedIcon />}
      {text === "OfficeHours" && <EventRoundedIcon />}
      {text === "FAQBoard" && <LiveHelpIcon />}
      {text === "People" && <PeopleIcon />}
      {text === "Assignments" && <AssignmentIcon />}
      {text === "Admin" && <HomeIcon />}
      {text === "AddAvailability" && <EventRoundedIcon />}
      {text === "CheckAppointmentStatus" && <AssignmentIcon />}

      <TextLabel text={text} active={active} />
    </div>;
}

function TextLabel({ text, active }) {
    return <h2 style={active ? styles.SideBarTextActive : styles.SideBarText}>
        {text}
    </h2>;
}

export default function Sidebar({ availablePages, currentPageTitle }) {
  const pageTitles = availablePages;
  const sidebarElements = pageTitles.map((title) => {
    return (
      <SideBarElement
      text={title}
      active={currentPageTitle === title}
      key={title}
    />
    );
  });
  return (
    <div style={styles.Sidebar}>
      <Toolbar />
      {sidebarElements}
    </div>
  );
}

let styles = {
  Sidebar: {
    background: "white",
    display: "flex",
    flexDirection: "column" as "column",
    gap: "3vh",
    alignItems: "center",
    fontFamily: "Poppins",
    fontColor: "black",
  },
  SidebarElement: {
    borderRadius: "5px",
    display: "flex",
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "5%",
    paddingLeft: "5%",
    cursor: "pointer",
  },
  SideBarText: {
    fontSize: "14px",
  },
  SideBarTextActive: {
    fontSize: "14px",
    fontWeight: "900",
  },
};