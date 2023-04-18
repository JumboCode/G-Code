import React from "react";
import { useState } from 'react';
import IsUserAuthorized from "../components/authentification";
import AdminOfficeHours from "../components/admin_pages/AdminOfficeHours";
import StudentOfficeHours from "../components/student_pages/StudentOfficeHours";

export default function OfficeHours() {
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
    return <AdminOfficeHours user={user}/>
  } else if (user.type == "student") {
    return <StudentOfficeHours user={user} />
  } else {
    return <p>Authentication Error</p>
  }
}
