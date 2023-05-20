import React, { useEffect } from "react";
import { useRouter } from 'next/router';

const LogoutPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear the session cookie
    document.cookie = "gcode-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect the user to the login page
    router.push("/Login");
  });

  return (
    <p>Logging out...</p>
  );
};

export default LogoutPage;