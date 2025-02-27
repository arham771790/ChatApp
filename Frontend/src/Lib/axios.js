import axios from 'axios';
 const instance = axios.create({
    baseURL: import.meta.env.MODE==='development'? 'https://chatapp-raff.onrender.com/api':"/api",
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  export default instance;