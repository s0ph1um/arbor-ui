import { useQuery } from "@tanstack/react-query";
import { type UserInfo, usersApi } from "../api/users";

export const useUsers = () => {
  return useQuery<UserInfo[]>({
    queryKey: ["users"],
    queryFn: () => usersApi.getUsers(),
    staleTime: 1000 * 60 * 5,
  });
};
