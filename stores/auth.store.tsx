"use client";

import { Company } from "@/app/generated/prisma/client";
import { createContext, useContext, ReactNode } from "react";

interface AuthStore {
  company: Company | null;
  isAuthenticated: boolean;
}

const AuthStoreContext = createContext<AuthStore | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  company: Company | null;
}

export function AuthProvider({ children, company }: AuthProviderProps) {
  const store: AuthStore = {
    company,
    isAuthenticated: !!company,
  };

  return (
    <AuthStoreContext.Provider value={store}>
      {children}
    </AuthStoreContext.Provider>
  );
}

/**
 *
 * @throws
 */
export function useAuthStore() {
  const context = useContext(AuthStoreContext);

  if (context === undefined) {
    throw new Error("useAuthStore must be used within an AuthProvider");
  }

  return context;
}
