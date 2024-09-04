import axios from 'axios';

const logout = async () => {
  try {
    //await axios.post('http://localhost:8080/auth/logout');
    localStorage.removeItem('token');
    window.location.href = '/';
  } catch (error) {
    console.error('There was an error logging out!', error);
  }
};

export default logout;