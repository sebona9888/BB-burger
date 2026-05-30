import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://prime-backend.onrender.com";

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000,
});

export default api;