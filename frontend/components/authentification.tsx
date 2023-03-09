import axios from "axios";
import { useEffect, Component, ComponentType, FC } from "react";
import { useRouter } from "next/router";

export default function IsUserAuthorized(required_permission, save_user) {
  const router = useRouter();
  const permissions = { None: 0, Student: 1, Admin: 2 };
  useEffect(() => {
    const validateSession = async () => {
      try {
        var result = await axios.get("http://localhost:8000/validate", {
          withCredentials: true,
        });
        let user_permission = result.data["permission_level"];
        save_user(result.data);
        if (permissions[user_permission] < permissions[required_permission]) {
          throw new Error("Invalid Permission");
        }
      } catch (error) {
        router.push("/Login");
      }
    };
    validateSession();
  });
}
