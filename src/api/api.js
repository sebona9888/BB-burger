import axios from 'axios';

const api = axios.create({
  baseURL: 'https://beebboo-burger-backend.onrender.com/api/v1',
});

export default api;