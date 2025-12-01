"use client";

import { Company } from "@/app/generated/prisma/client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";

interface AuthStore {
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthStoreContext = createContext<AuthStore | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  company: Company | null;
}

export function AuthProvider({ children, company: initialCompany }: AuthProviderProps) {
  const [company, setCompany] = useState<Company | null>(initialCompany);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if the current session is valid
   */
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/check", {
        credentials: "include",
      });
      const data = await res.json();
      return data.authenticated;
    } catch {
      return false;
    }
  }, []);

  /**
   * Refresh the session using the refresh_session cookie
   * No body required - the cookie is sent automatically
   */
  const refresh = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to refresh session");
        setCompany(null);
        return false;
      }

      // Fetch updated company info after refresh
      const meRes = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (meRes.ok) {
        const companyData = await meRes.json();
        setCompany(companyData);
        return true;
      }

      return false;
    } catch (err) {
      setError("Session expired. Please reinstall the app.");
      setCompany(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout and destroy the session
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setCompany(null);
    } catch (err) {
      setError("Failed to logout");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const store: AuthStore = {
    company,
    isAuthenticated: !!company,
    isLoading,
    error,
    refresh,
    logout,
    checkAuth,
  };

  return (
    <AuthStoreContext.Provider value={store}>
      {children}
    </AuthStoreContext.Provider>
  );
}

/**
 * Hook to access auth store
 * @throws Error if used outside AuthProvider
 */
export function useAuthStore() {
  const context = useContext(AuthStoreContext);

  if (context === undefined) {
    throw new Error("useAuthStore must be used within an AuthProvider");
  }

  return context;
}
