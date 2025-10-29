import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// const API_URL = "http://192.168.0.27:7700/v1/api/attendance";
const API_URL = "http://192.168.0.27:7700/v1/api/attendance";

const ApiAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Intercept request to prepend branch in the path
ApiAxios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

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
