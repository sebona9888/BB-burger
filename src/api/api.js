import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://beebboo-burger-backend.onrender.com";

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
});

export default api;