import axios from 'axios';

const axiosV2 = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI+'/api/v2',
  headers: { 'Content-Type': 'application/json' },
});

axiosV2.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

export default axiosV2;
