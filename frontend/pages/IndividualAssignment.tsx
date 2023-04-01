import Sidebar from "../components/sidebar";
import styles from "../styles/Home.module.css";
import assignentStyles from "../styles/Assignments.module.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import IndividualAssignment from './IndividualAssignment';
import React, { useState } from "react";
import { makeStyles } from "@mui/material";
import { Button, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from "axios";

export default function Assignments() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.container}>
      <Sidebar currentPageTitle="Assignments" />
      <div className={assignentStyles.grid}>

        <div className={`${assignentStyles.leftColumn} ${assignentStyles.column50}`}>
          <div className={`${assignentStyles.header1}`}>
            <p> ASSIGNMENT TITLE </p>
            <p className={assignentStyles.dueDate}> DUE DATE, TIME REMAINING</p>
          </div>
          <p className={`${assignentStyles.description}`}>
            Assignment Description
          </p>
          <div className={`${assignentStyles.descriptionBox}`}>
            <p className={assignentStyles.details}> Lorem ipsum </p>
          </div>
          <div className={`${assignentStyles.feedback}`}>
            <p> Submission Feedback</p>
          </div>
        </div>
        <div className={`${assignentStyles.rightColumn} ${assignentStyles.column50}`}>
          <div className={assignentStyles.rightSide}>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              style={{ textTransform: "none", color: "black", fontFamily: "IBM Plex Sans" }}
            >
              Ariya
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Log Out</MenuItem>
            </Menu>
          </div>
          <div className={`${assignentStyles.submitButton}`}>
            <Button
              variant="contained"
              sx={{ textTransform: "none", width: "200px", bgcolor: "#6E59F7", color: "white" }}
              onClick={() => console.log("Submit button clicked")}
            >
              Submit
            </Button>
          </div>
          <div className={assignentStyles.resourcesMenu}>
          <Button
            aria-controls="resources-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
            style={{ textTransform: "none", color: "black", fontFamily: "Red Hat Display", borderRadius: "20px", backgroundColor: "#FFFFFF", padding: "8px 16px", fontSize: "16px" }}
            endIcon={<ArrowDropDownIcon />}
          >
            Helpful Resources
          </Button>
          <Menu
            id="resources-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            style={{ borderRadius: "20px" }}
          >
            <MenuItem onClick={handleMenuClose}>Resource 1</MenuItem>
            <MenuItem onClick={handleMenuClose}>Resource 2</MenuItem>
            <MenuItem onClick={handleMenuClose}>Resource 3</MenuItem>
          </Menu>
        </div>
        <div className={assignentStyles.commonQs}>
          <p> Commonly Asked Questions</p>
          <div className={`${assignentStyles.descriptionBox2}`}>
            <p className={assignentStyles.details2}> Lorem ipsum </p>
          </div>
        </div>
        

        </div>
      </div>
    </div>
  );
}
