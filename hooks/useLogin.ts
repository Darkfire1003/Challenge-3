import { useMutation } from "@tanstack/react-query";
import { authApi } from "../app/api/config";
import { LoginInfo, AuthResponse } from "@/types/auth";

export function useLogin() {
  return useMutation({
    mutationFn: async (info: LoginInfo) => {
      const { data } = await authApi.post<AuthResponse>(
        "/token?grant_type=password",
        info,
      );
      return data;
    },
  });
}
