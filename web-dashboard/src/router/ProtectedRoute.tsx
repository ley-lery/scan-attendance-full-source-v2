/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import authService from "@/services/auth.service";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authService.userProfile(token);
        setUser(res.data.user);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // ===== Loading state =====
  if (loading) return null;

  // ===== Not authenticated =====
  if (!token || !user) return <Navigate to="/login" replace />;

  // ===== All good, render protected component =====
  return <Component />;
};

export default ProtectedRoute;
