
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AgentProvider } from "@/contexts/AgentContext";
import { ChatProvider } from "@/contexts/ChatContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import { api } from "@/services/api";

import Login from "@/pages/Login";
import Index from "@/pages/Index";
import Chat from "@/pages/Chat";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import AdminDashboard from "@/pages/AdminDashboard";

// Create a new QueryClient instance with default options for error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Initialize API configuration
const initializeApiConfig = () => {
  const baseUrl = localStorage.getItem("inventu_api_base_url") || import.meta.env.VITE_API_URL || "";
  const token = localStorage.getItem("inventu_api_token");
  
  if (baseUrl) {
    console.log("Initialized API with base URL:", baseUrl);
  }
  
  if (token) {
    api.setAuthToken(token);
  }
};

const App = () => {
  // Initialize API configuration on app start
  useEffect(() => {
    initializeApiConfig();
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AgentProvider>
            <ChatProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Public route */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* User routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Redirect /settings to /admin for admin users */}
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Navigate to="/admin" replace />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </ChatProvider>
          </AgentProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
