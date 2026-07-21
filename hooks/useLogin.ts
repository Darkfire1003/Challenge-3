import { useMutation } from "@tanstack/react-query";
import { api } from "../app/api/config";
import { LoginCredentials, AuthResponse } from "@/types/auth";

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<AuthResponse>("/login", credentials);
      return data;
    },
  });
}
