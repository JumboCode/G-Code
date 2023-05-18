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
import { student_pages, admin_pages } from '../constants'

import Margin from "../components/margin";

const Page = () => {
  const router = useRouter()
  const { slug } = router.query

  const [user, setUser] = useState(null);
  const save_user = curr_user => {
    if (user == null) {
      setUser(curr_user)
    }
  }
  /* Authorize user and return user 
   * information (ex. first name, username, ect.) */
  IsUserAuthorized(save_user)

  if (!user || !slug) {
    return <p>Loading...</p>
  }

  if (user.type == "student") {
    if (student_pages.includes(slug[0].toString())) {
      return (
        <>
          <Margin
            user={user}
            availablePages={student_pages}
            currentPageTitle={slug[0]}
          >
            {slug[0] == "Dashboard" && <StudentDashboard user={user} />}
            {slug[0] == "Assignments" && <StudentAssignments user={user} assignment_id={slug.length > 1 && slug[1]} />}
            {slug[0] == "FAQBoard" && <GeneralFAQBoard user={user} question_id={slug.length > 1 && slug[1]} />}
            {slug[0] == "OfficeHours" && <StudentOfficeHours user={user} />}
            {slug[0] == "People" && <GeneralPeople user={user} />}
            {slug[0] == "Profile" && <StudentProfile user={user} />}
          </Margin>
        </>
      )
    }
  } else {
    if (admin_pages.includes(slug[0].toString())) {
      return (
        <>
          <Margin
            user={user}
            availablePages={admin_pages}
            currentPageTitle={slug[0]}
          >
            {slug[0] == "Dashboard" && <AdminDashboard user={user} />}
            {slug[0] == "Assignments" && <AdminAssignments user={user} assignment_id={slug.length > 1 && slug[1]}/>}
            {slug[0] == "FAQBoard" && <GeneralFAQBoard user={user} question_id={slug.length > 1 && slug[1]} />}
            {slug[0] == "OfficeHours" && <AdminOfficeHours user={user} />}
            {slug[0] == "People" && <GeneralPeople user={user} />}
            {slug[0] == "Profile" && <AdminProfile user={user} />}
          </Margin>
        </>
      )
    }
  }

  return (
    <>
      <Box sx={{ mt: 20 }}>
        <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '54px' }}>Page Not Found</p>
      </Box>
    </>
  )
}

export default Page