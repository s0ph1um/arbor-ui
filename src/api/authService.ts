import axios from 'axios';
import type { User } from "../types/auth.types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

class AuthService {


  async checkAuth(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/user');
      return response.data;
    } catch (error) {
      console.error('Auth check failed:', error);
      return { authenticated: false };
    }
  }

  async logout(): Promise<void> {
    await apiClient.get('/auth/logout');
  }

  redirectToLogin(): void {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  }
}

export const authService = new AuthService();
