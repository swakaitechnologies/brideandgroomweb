import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import React from "react";

/**
 * ProtectedRoute component to handle authentication guards.
 * Replaces Next.js middleware logic.
 */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const GuestOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
