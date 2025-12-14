// import axios from 'axios';

// const api = axios.create({
//   // 👇 CRITICAL FIX: Use localhost for development
//   baseURL: 'http://localhost:5000/api', 
// });

// // Attach token automatically to every request
// api.interceptors.request.use((config) => {
//   const user = JSON.parse(localStorage.getItem('user'));
//   const token = user?.token || localStorage.getItem('token');
  
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


import axios from 'axios';

// 👇 AUTOMATIC SWITCHING LOGIC
// 1. If you run "npm run dev", it uses http://localhost:5000/api
// 2. If you deploy to Vercel/Netlify, it uses your Railway URL automatically.
const BASE_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000/api' 
  : 'https://mern-movie-app-production.up.railway.app/api'; 

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token automatically to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token || localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;