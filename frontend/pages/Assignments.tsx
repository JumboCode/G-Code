import React from "react";
import { useState } from 'react';
import IsUserAuthorized from "../components/authentification";
import AdminAssignments from "../components/admin_pages/AdminAssignments";
import StudentAssignments from "../components/student_pages/StudentAssignments";

export default function Assignments() {
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
    return <AdminAssignments user={user}/>
  } else if (user.type == "student") {
    return <StudentAssignments user={user} />
  } else {
    return <p>Authentication Error</p>
  }
}
