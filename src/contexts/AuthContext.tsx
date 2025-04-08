
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, User } from "../types";

interface UpdateProfileData {
  name?: string;
  profileImage?: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@inventu.com",
    password: "admin123",
    role: "admin" as const,
    profileImage: null,
  },
  {
    id: "2",
    name: "Test User",
    email: "user@inventu.com",
    password: "user123",
    role: "user" as const,
    profileImage: null,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored auth on load
    const storedUser = localStorage.getItem("inventu_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("inventu_user");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(user => 
      user.email === email && user.password === password
    );
    
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    // Store user in local storage
    localStorage.setItem("inventu_user", JSON.stringify(userWithoutPassword));
    
    setAuthState({
      user: userWithoutPassword,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("inventu_user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = (data: UpdateProfileData) => {
    if (!authState.user) return;

    const updatedUser = {
      ...authState.user,
      ...data
    };

    // Update local storage
    localStorage.setItem("inventu_user", JSON.stringify(updatedUser));

    // Update state
    setAuthState({
      ...authState,
      user: updatedUser
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
