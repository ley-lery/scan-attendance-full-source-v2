// utils/jwt.ts
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  user_id: number;
  email: string;
  username: string;
  assign_type: string;
  branch?: string; 
  exp: number;
  iat: number;
}

export const decodeToken = (): DecodedToken | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};
