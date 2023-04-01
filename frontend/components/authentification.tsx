import axios from 'axios';
import { useEffect,  Component, ComponentType, FC  } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function IsUserAuthorized(required_permission, save_user) {
  const router = useRouter();
  const permissions = { "None": 0, "Student": 1, "Admin": 2 }
  useEffect(() => {
    const validateSession = async () => {
      const token = Cookies.get('gcode-session');
      try {
        const config = {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + token
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
        router.push('/Login');
      }
    };
    validateSession();
  });
}