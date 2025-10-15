/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const { activeAccount } = useAuth();
  const token = activeAccount?.token;
  const user = activeAccount?.user;
 

  // ===== Loading state =====
  if (!token || !user) return null;

  // ===== Not authenticated =====
  if (!token || !user) return <Navigate to="/login" replace />;

  // ===== All good, render protected component =====
  return <Component />;
};

export default ProtectedRoute;
