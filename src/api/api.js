import axios from "axios";

// Kuni variable Vercel irraa dhufu fayyadama
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export default api;