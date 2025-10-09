import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ApiAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor to use active account token
ApiAxios.interceptors.request.use((config) => {
  // Get the active account from localStorage
  const stored = localStorage.getItem("activeAccount");
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Error parsing active account token", err);
    }
  }

  // Ensure URL starts with '/'
  if (config.url && !config.url.startsWith("/")) {
    config.url = `/${config.url}`;
  }

  return config;
});

export default ApiAxios;
