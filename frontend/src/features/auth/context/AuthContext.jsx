import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser as apiGetCurrentUser,
  refreshToken as apiRefreshToken,
} from "@/services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const meRes = await apiGetCurrentUser();
        if (isMounted) {
          setUser(meRes?.data || null);
        }
      } catch {
        // Access token might be expired, attempt refresh
        try {
          await apiRefreshToken();
          const meRes = await apiGetCurrentUser();
          if (isMounted) {
            setUser(meRes?.data || null);
          }
        } catch {
          if (isMounted) {
            setUser(null);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await apiLogin({ email, password });
    try {
      const meRes = await apiGetCurrentUser();
      setUser(meRes?.data || res?.data?.user || null);
    } catch {
      setUser(res?.data?.user || null);
    }
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const meRes = await apiGetCurrentUser();
      setUser(meRes?.data || null);
      return meRes?.data || null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to access auth context
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
