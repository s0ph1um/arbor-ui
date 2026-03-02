import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext.tsx";
import { authService } from "../api/authService.ts";
import type { AuthContextType, User } from "../types/auth.types.ts";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const userData = await authService.checkAuth();
      if (userData.authenticated) {
        setUser(userData);
        setLoading(false);
      } else {
        authService.redirectToLogin();
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
      authService.redirectToLogin();
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      authService.redirectToLogin();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const contextValue: AuthContextType = {
    currentUser: user,
    loading,
    isAuthenticated: Boolean(user?.authenticated),
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
