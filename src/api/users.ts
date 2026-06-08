import { apiClient } from "./client";

export interface UserInfo {
  id: number;
  email: string;
  name?: string;
  picture?: string;
  token: string;
}

export const usersApi = {
  getUsers: async (): Promise<UserInfo[]> => {
    const { data } = await apiClient.get("/users");
    return data;
  },

};
