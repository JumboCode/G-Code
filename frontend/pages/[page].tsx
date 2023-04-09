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

    console.log(user)

    if (user && user.type in ["admin", "student"]) {
        return <p>not authenticated...</p>
    } 
    
    switch(page) {
        case "Dashboard":
            return (user == "admin")? <AdminDashboard user={user}/> : <StudentDashboard user={user}/>
        case "Assignments":
            return (user == "admin")? <AdminAssignments user={user}/> : <StudentAssignments user={user}/>
        case "FAQBoard":
            return <GeneralFAQBoard user={user}/>
        case "People":
            return <GeneralPeople user={user}/>
        case "OfficeHours":
            return (user == "admin")? <AdminOfficeHours user={user}/> : <StudentOfficeHours user={user}/>
        default:
            return <p> page {page} not found </p>
    }
}

export default Page