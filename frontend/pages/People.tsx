import React from "react";
import { useState } from 'react';
import IsUserAuthorized from "../components/authentification";
import GeneralPeople from "../components/general_pages/GeneralPeople"

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
  } else if (user.type == "admin" || user.type == "student") {
    return <GeneralPeople user={user} />
  } else {
    return <p>Authentication Error</p>
  }
}
