import React from "react";
import { useState } from 'react';
import IsUserAuthorized from "../components/authentification";
import AdminAssignments from "../components/admin_pages/AdminAssignments";
import StudentAssignments from "../components/student_pages/StudentAssignments";
import { useRouter } from 'next/router'
import AdminDashboard from "../components/admin_pages/AdminDashboard";
import StudentDashboard from "../components/student_pages/StudentDashboard"
import GeneralFAQBoard from "../components/general_pages/GeneralFAQBoard";
import GeneralPeople from "../components/general_pages/GeneralPeople";
import AdminOfficeHours from "../components/admin_pages/AdminOfficeHours";
import StudentOfficeHours from "../components/student_pages/StudentOfficeHours";
import StudentProfile from "../components/student_pages/StudentProfile";
import AdminProfile from "../components/admin_pages/AdminProfile";
import Box from "@mui/material/Box";

import Margin from "../components/margin";

const Page = () => {
    const router = useRouter()
    const { page } = router.query

    const [user, setUser] = useState(null);
    const save_user = curr_user => {
        if (user == null) {
            setUser(curr_user)
        }
    }
    /* Authorize user and return user 
     * information (ex. first name, username, ect.) */
    IsUserAuthorized(save_user)

    const student_pages = ["Dashboard", "Assignments", "FAQBoard", "OfficeHours", "People"]
    const admin_pages = ["Dashboard", "Assignments", "FAQBoard", "OfficeHours", "People"]

    if (!user) {
        return <></>
    }

    if (user.type == "student") {
      if (!page) {
        return (
          <>
          <Margin
                    user={user}
                    availablePages={student_pages}
                    currentPageTitle={"Dashboard"}
                >
                    {page == "Dashboard" && <StudentDashboard user={user} />}
                    {page == "Assignments" && <StudentAssignments user={user} />}
                    {page == "FAQBoard" && <GeneralFAQBoard user={user} />}
                    {page == "OfficeHours" && <StudentOfficeHours user={user} />}
                    {page == "People" && <GeneralPeople user={user} />}
                    {page == "Profile" && <StudentProfile user={user}/>}
                </Margin>
          </>
        )
      }
        else if (student_pages.includes(page.toString())) {
            return (
              <>
                <Margin
                    user={user}
                    availablePages={student_pages}
                    currentPageTitle={page}
                >
                    {page == "Dashboard" && <StudentDashboard user={user} />}
                    {page == "Assignments" && <StudentAssignments user={user} />}
                    {page == "FAQBoard" && <GeneralFAQBoard user={user} />}
                    {page == "OfficeHours" && <StudentOfficeHours user={user} />}
                    {page == "People" && <GeneralPeople user={user} />}
                    {page == "Profile" && <StudentProfile user={user}/>}
                </Margin>
                </>
            )
        } else {
             return (
                <>
                <Box sx = {{ mt: 20 }}>
                  <p style={{textAlign: 'center', fontWeight: 'bold', fontSize: '54px'}}>Page Not Found</p>
                </Box>
                </>
              )
        }
    } else {
      if (!page) {
        return (
          <>
          <Margin
                    user={user}
                    availablePages={admin_pages}
                    currentPageTitle={"Dashboard"}
                >
                    {page == "Dashboard" && <AdminDashboard user={user} />}
                    {page == "Assignments" && <AdminAssignments user={user} />}
                    {page == "FAQBoard" && <GeneralFAQBoard user={user} />}
                    {page == "OfficeHours" && <AdminOfficeHours user={user} />}
                    {page == "People" && <GeneralPeople user={user} />}
                    {page == "Profile" && <AdminProfile user={user}/>}
                </Margin>
          </>
        )
      }
        if (admin_pages.includes(page.toString())) {
            return (
              <>
                <Margin
                    user={user}
                    availablePages={admin_pages}
                    currentPageTitle={page}
                >
                    {page == "Dashboard" && <AdminDashboard user={user} />}
                    {/* {page == "Assignments" && <AdminAssignments user={user} />} */}
                    {page == "FAQBoard" && <GeneralFAQBoard user={user} />}
                    {page == "OfficeHours" && <AdminOfficeHours user={user} />}
                    {page == "People" && <GeneralPeople user={user} />}
                    {page == "Profile" && <AdminProfile user={user}/>}
                </Margin>
              </>
            )
        } else {
          return (
            <>
            <Box sx = {{ mt: 20 }}>
              <p style={{textAlign: 'center', fontWeight: 'bold', fontSize: '54px'}}>Page Not Found</p>
            </Box>
            </>
          )
        }
    }
}

export default Page