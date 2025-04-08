
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"admin" | "user">;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse-light text-center">
          <p className="text-xl font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check roles if specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect users based on role
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // If user is admin and trying to access a non-admin route without explicit role check
  if (!allowedRoles && user?.role === "admin" && window.location.pathname === "/") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
