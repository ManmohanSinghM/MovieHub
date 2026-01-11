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

// 1. BEST PRACTICE: Trust your .env file for the URL.
// In local .env: VITE_BACKEND_URL=http://localhost:5000/api
// In AWS .env:   VITE_BACKEND_URL=http://YOUR_ELASTIC_IP:5000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
});

// 2. REQUEST INTERCEPTOR (Attach Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. RESPONSE INTERCEPTOR (Auto-Logout on 401)
// This makes your app feel professional. If the token expires, 
// it kicks the user to login instead of showing random errors.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      // Optional: Redirect to login (window.location.href = '/login')
      // but usually, the AuthContext updates state automatically.
    }
    return Promise.reject(error);
  }
);

export default api;
