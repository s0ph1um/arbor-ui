import { createContext, useContext } from "react";
import type { AuthContextType } from "../types/auth.types.ts";

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Cannot get context");
  }
  return context;
};
