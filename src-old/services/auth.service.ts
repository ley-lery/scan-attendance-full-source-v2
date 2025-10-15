/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

interface User {
  image?: string;
  username?: string;
  password: string;
  email?: string;
  studentId?: string;
}

const AuthService = {
  async register(data: User | FormData) {
    await axios.post(`${API_URL}/auths/register`, data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
  },

  async lecturerSignIn(data: { email: string; password: string }) {
    const res = await axios.post(`${API_URL}/auth/user/signin`, data);
    return res.data;
  },

  async studentSignIn(data: { studentId: string; password: string }) {
    const res = await axios.post(`${API_URL}/auth/user/signin`, data);
    return res.data;
  },

  async logout(token: string) {
    const res = await axios.post(`${API_URL}/auth/user/signout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  async userProfile(token: string) {
    try {
      const res = await axios.get(`${API_URL}/auth/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e: any) {
      console.error("Error fetching profile: ", e.response?.data || e.message || e);
      throw e;
    }
  },
};

export default AuthService;
