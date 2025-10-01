/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;
interface User {
  image: string;
  username: string;
  password: string;
}
const AuthService = {
  async register(data: User | FormData) {
    await axios.post(`${API_URL}/auths/register`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  },
  async lecturerSigIn(data: { email: string; password: string }) {
    const res = await axios.post(`${API_URL}/auth/user/signin`, data);
    return res.data;
  },
  async studentSigIn(data: { studentId: string; password: string }) {
    const res = await axios.post(`${API_URL}/auth/user/signin`, data);
    return res.data;
  },
  async userProfile(token: string) {
    try {
      const res = await fetch(`${API_URL}/auth/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the response is ok (status code 200-299)
      if (!res.ok) throw new Error(`Error: ${res.status} - ${res.statusText}`);

      // Parse the JSON response
      return await res.json();
    } catch (e: any) {
      console.error("Error fetching profile: ", e.message || e);
      throw e; // Re-throw the error to be handled by the caller
    }
  }
}

export default AuthService;
