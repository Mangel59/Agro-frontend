import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://172.16.79.156:8080', // Update with your backend URL
});

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log("token:" + token);
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;

