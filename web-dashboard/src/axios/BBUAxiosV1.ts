import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BBU_URL;

const BBUAxiosV1 = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

BBUAxiosV1.interceptors.request.use((config) => {
  const token = localStorage.getItem("bbu-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Ensure URL starts with `/`
  if (config.url && !config.url.startsWith("/")) {
    config.url = `/${config.url}`;
  }

  return config;
});

export default BBUAxiosV1;
