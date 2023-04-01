import React from 'react';
import { useState } from 'react';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import PeopleIcon from '@mui/icons-material/People';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import "@fontsource/poppins";
import { useRouter } from 'next/router';
import { Toolbar } from '@mui/material'


const pageTitles = ['Dashboard', 'Office Hours', 'FAQ Board', 'People', 'Assignments', 'IndividualAssignment']

function SideBarElement({ text, active, setActive }) {
    const [isHover, setIsHover] = useState(false);
    const router = useRouter();
    return <div
        key={text}
        onClick={function () {
            setActive();
            router.push("/" +
                text === "Dashboard" ? ''
                : text.replace(/\s/g, ''));
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
        {text === "Office Hours" && <EventRoundedIcon />}
        {text === "FAQ Board" && <LiveHelpIcon />}
        {text === "People" && <PeopleIcon />}
        {text === "Assignments" && <AssignmentIcon />}
        {text === "IndividualAssignment" && <AssignmentIcon />}
        <TextLabel text={text} active={active} />
    </div >;
}

function TextLabel({ text, active }) {
    return <h2 style={active ? styles.SideBarTextActive : styles.SideBarText}>
        {text}
    </h2>;
}

export default function Sidebar({ currentPageTitle }) {
    const [activePage, setActivePage] = useState(currentPageTitle);
    const sidebarElements = pageTitles.map((title) => {
        return (
          <SideBarElement
            text={title}
            active={activePage === title}
            setActive={() => setActivePage(title)}
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
};

let styles = ({
    Sidebar:
    {
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '3vh',
        alignItems: 'center',
        fontFamily: "Poppins",
        fontColor: "black"
    },
    SidebarElement:
    {
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '5%',
        paddingLeft: '5%',
        cursor: 'pointer',
    },
    SideBarText:
    {
        fontSize: '14px',
    },
    SideBarTextActive:
    {
        fontSize: '14px',
        fontWeight: "900",
    },
})