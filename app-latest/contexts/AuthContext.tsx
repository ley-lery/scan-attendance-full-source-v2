import ApiAxios from "@/axios/ApiAxios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "student" | "lecturer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  is_scanned?: number;
  student_code?: string;
  avatar?: string;
}

export interface Lecturer extends User {
  user_code?: string;
  years_experience?: number;
  total_students?: number;
  total_courses?: number;
}

interface AuthContextType {
  user: User | Lecturer | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: any; error?: string }>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | Lecturer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to check auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthState();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await ApiAxios.post("/auth/user/signup", { name, email, password });

      if (response.data?.success) {
        const newUser = response.data.data.user;
        const token = response.data.data.token;
        const userToStore = { ...newUser, token };

        await AsyncStorage.setItem("user", JSON.stringify(userToStore));
        setUser(userToStore);

        return { success: true };
      } else {
        return { success: false, error: response.data?.message || "Registration failed" };
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      return { success: false, error: error.response?.data?.message || "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await ApiAxios.post("/auth/user/signin", { email, password });
      console.log(JSON.stringify(response.data, null, 2), "login response from AuthContext");

      if (response.data?.success) {
        const userData = response.data.data.user;
        const token = response.data.data.token;
        const userToStore = { ...userData, token };

        await AsyncStorage.setItem("user", JSON.stringify(userToStore));
        setUser(userToStore);

        return { success: true, user: userToStore };
      } else {
        return { success: false, error: response.data?.message || "Invalid email or password" };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.response?.data?.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
