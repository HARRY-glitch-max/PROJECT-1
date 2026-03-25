import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const storedUser = localStorage.getItem("jobConnectUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // 🚫 If no user or token, redirect to login
  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 If allowedRoles is provided and user role not included, block access
  if (allowedRoles && !allowedRoles.includes(user.roles)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Otherwise, render the protected page
  return children;
}
