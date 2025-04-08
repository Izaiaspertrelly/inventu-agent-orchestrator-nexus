
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

  // IMPORTANT: Remove this restriction to allow admins to access user routes
  // This was preventing the "Ir para Aplicação" button from working properly
  /*
  if (!allowedRoles && user?.role === "admin" && window.location.pathname === "/") {
    return <Navigate to="/admin" replace />;
  }
  */

  return <>{children}</>;
};

export default ProtectedRoute;
