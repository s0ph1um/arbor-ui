export interface User {
  id?: number;
  authenticated: boolean;
  name?: string;
  email?: string;
  picture?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}
