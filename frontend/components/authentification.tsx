import axios from 'axios';
import { useEffect, Component, ComponentType, FC } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function IsUserAuthorized(save_user) {
  const router = useRouter();
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
        save_user(result.data)
      } catch (error) {
        router.push('/Login');
      }
    };
    validateSession();
  });
}