import React from "react";
import { useState } from "react";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import "@fontsource/poppins";
import { useRouter } from "next/router";

function GCodeHeading() {
  return (
    <div style={styles.GCodeHeading}>
      <img style={styles.GCodeHeadingImage} src="/GCodeLogo.png" />
      <h1 style={styles.GCodeHeadingText}>{"Intro to G{Code}"}</h1>
    </div>
  );
}

function SideBarElement({ text, active, setActive }) {
  const [isHover, setIsHover] = useState(false);
  const router = useRouter();
  return (
    <div
      onClick={function () {
        setActive();
        router.push("/" + text === "Dashboard" ? "" : text.replace(/\s/g, ""));
      }}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      style={{
        ...styles.SidebarElement,
        backgroundColor: active
          ? "rgba(226, 255, 248, 0.84)"
          : isHover
          ? "rgba(226, 255, 248, 0.84)"
          : "white",
      }}
    >
      {text === "Dashboard" && <GridViewRoundedIcon />}
      {text === "Tutoring" && <EventRoundedIcon />}
      {text === "Course Calendar" && <BookmarksOutlinedIcon />}
      {text === "Resources" && <LocalFireDepartmentOutlinedIcon />}
      {text === "Assignments" && <LocalFireDepartmentOutlinedIcon />}

      <TextLabel text={text} />
    </div>
  );
}

function TextLabel({ text, active }) {
  return <h2 style={styles.SideBarText}>{text}</h2>;
}

// function NotificationNumber({ number }) {
//     return <div style={{
//         backgroundColor: 'blue',
//         borderRadius: '50%',
//         width: '10%',
//     }} />;
// }

export default function Sidebar({ currentPageTitle }) {
  const [activePage, setActivePage] = useState(currentPageTitle);
  return (
    <div style={styles.Sidebar}>
      <GCodeHeading />
      <SideBarElement
        text="Dashboard"
        active={activePage === "Dashboard"}
        setActive={() => setActivePage("Dashboard")}
      />
      <SideBarElement
        text="Tutoring"
        active={activePage === "Tutoring"}
        setActive={() => setActivePage("Tutoring")}
      />
      <SideBarElement
        text="Course Calendar"
        active={activePage === "Course Calendar"}
        setActive={() => setActivePage("Course Calendar")}
      />
      <SideBarElement
        text="Resources"
        active={activePage === "Resources"}
        setActive={() => setActivePage("Resources")}
      />
      <SideBarElement
        text="Assignments"
        active={activePage === "Assignments"}
        setActive={() => setActivePage("Assignments")}
      />
    </div>
  );
}

let styles = {
  Sidebar: {
    background: "white",
    display: "flex",
    flexDirection: "column",
    width: "fit-content",
    height: "100vh",
    gap: "3vh",
    alignItems: "center",
    borderRight: "1px solid #DFDFDF",
    fontFamily: "Poppins",
    fontColor: "black",
  },
  SidebarElement: {
    borderRadius: "5px",
    display: "flex",
    flexDirection: "row",
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "5%",
    paddingLeft: "5%",
    cursor: "pointer",
  },
  LogoSidebar: {
    height: "8%",
    width: "100%",
    // background: 'teal',
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    gap: "5%",
  },
  SideBarText: {
    fontSize: "14px",
    color: "black",
  },
  GCodeHeadingText: {
    fontFamily: "Poppins",
    fontSize: "16px",
  },
  GCodeHeading: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    gap: "5%",
  },
};
