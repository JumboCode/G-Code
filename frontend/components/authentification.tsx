import axios from 'axios';
import { useEffect, Component, ComponentType, FC } from 'react';
import { useRouter } from 'next/router';

export default function IsUserAuthorized(required_permission, save_user) {
  const router = useRouter();
  const permissions = { "None": 0, "Student": 1, "Admin": 2 }
  useEffect(() => {
    const validateSession = async () => {
      try {
        const config = {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKaW1teSIsImV4cCI6MTY4MDM5OTYwOH0.YQgbCMWfOjI0wTBqOVzuo2ccEXH6xS2aBc1nehU5TAw'
          }
        };
        
        let result = await axios.get('http://localhost:8000/', config)     
        
        console.log(result)

        let user_permission = result.data["permission_level"]
        save_user(result.data)
        if (permissions[user_permission] < permissions[required_permission]) {
          throw new Error('Invalid Permission');
        }
      } catch (error) {
        console.log(error)
        // router.push('/Login');
      }
    };
    validateSession();
  });
}