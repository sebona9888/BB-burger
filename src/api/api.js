import axios from "axios";

// ✅ Fix: Add /v1 to the URL
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,  // ✅ Added /v1 here
});

export default api;