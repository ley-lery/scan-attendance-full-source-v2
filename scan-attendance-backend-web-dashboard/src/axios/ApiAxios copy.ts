import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ApiAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Intercept request to prepend branch in the path
ApiAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Prepend branch to the request path if not already present
  if ( config.url && !config.url.startsWith(`/`)) {
    config.url = `/${config.url}`;
  }

  return config;
});

export default ApiAxios;



