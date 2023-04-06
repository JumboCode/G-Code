import React from "react";
import { useState } from 'react';
import IsUserAuthorized from "../components/authentification";
import AdminDashboard from "../components/admin_pages/AdminDashboard"
import StudentDashboard from "../components/student_pages/StudentDashboard"

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const save_user = curr_user => {
    if (user == null){
      setUser(curr_user)
    }
  }
  /* Authorize user and return user 
   * information (ex. first name, username, ect.) */
  IsUserAuthorized(save_user)

  if (!user) {
    return <p>Loading...</p>
  } else if (user.type == "admin") {
    return <AdminDashboard user={user}/>
  } else if (user.type == "student") {
    return <StudentDashboard user={user} />
  } else {
    return <p>Authentication Error</p>
  }
}
