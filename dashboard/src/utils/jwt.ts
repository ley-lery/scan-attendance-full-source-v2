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

/**
 * Decode the active account's JWT token from localStorage
 */
export const decodeToken = (): DecodedToken | null => {
  const stored = localStorage.getItem("activeAccount");
  if (!stored) return null;

  try {
    const { token } = JSON.parse(stored);
    if (!token) return null;

    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

/**
 * Decode a specific JWT token
 */
export const decodeSpecificToken = (token: string): DecodedToken | null => {
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};
