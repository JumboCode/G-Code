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
    const admin_pages = ["Dashboard", "Assignments", "FAQBoard", "OfficeHours", "CheckAvailability", "People"]

    if (!user) {
        return <p>not authenticated...</p>
    }

    if (user.type == "student") {
        if (student_pages.includes(page.toString())) {
            return (
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
                </Margin>
            )
        } else {
            return "page not found"
        }
    } else {
        if (admin_pages.includes(page.toString())) {
            return (
                <Margin
                    user={user}
                    availablePages={student_pages}
                    currentPageTitle={page}
                >
                    {page == "Dashboard" && <AdminDashboard user={user} />}
                    {page == "Assignments" && <AdminAssignments user={user} />}
                    {page == "FAQBoard" && <GeneralFAQBoard user={user} />}
                    {page == "OfficeHours" && <AdminOfficeHours user={user} />}
                    {page == "People" && <GeneralPeople user={user} />}
                </Margin>
            )
        } else {
            return "page not found"
        }
    }
}

export default Page