import axios from "axios";
import { decodeToken } from "@/utils/jwt";

const API_BASE_URL = import.meta.env.VITE_API_BBU_URL;

const BranchAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

BranchAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("bbu-token");
  const branch = decodeToken()?.branch?.toLowerCase();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Auto prepend branch into URL if the request uses :branch param pattern
  if (branch && config.url && config.url.includes(":branch")) {
    config.url = config.url.replace(":branch", branch);
  }

  return config;
});

export default BranchAxios;
