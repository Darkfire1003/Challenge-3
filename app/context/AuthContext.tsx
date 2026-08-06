"use client";

import { createContext, useContext, useState } from "react";

type AuthContextType = {
  accessToken: string | null;
  userId: string | null;
  isInitialized: boolean;
  login: (accessToken: string, userId: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  );
  const [userId, setUserId] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null,
  );
  const [isInitialized] = useState(true);

  const login = (token: string, id: string) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user_id", id);
    setAccessToken(token);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    setAccessToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, userId, isInitialized, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
