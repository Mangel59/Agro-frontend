// import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'http://172.16.79.156:8080', // URL de tu backend
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   mode: 'no-cors', // Agrega esta línea para evitar preflight requests
// });

// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default instance;
// axiosConfig.js
// src/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI + "/api",
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(
  (config) => {
    if (config.skipAuth) {
      if (config.headers?.Authorization) delete config.headers.Authorization;
      config.headers = { ...config.headers, Authorization: undefined };
      return config;
    }
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  },
  (e) => Promise.reject(e)
);

export default instance;

