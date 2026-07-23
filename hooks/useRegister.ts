import { useMutation } from "@tanstack/react-query";
import { api, authApi } from "@/app/api/config";
import { RegisterInfo, AuthResponse } from "@/types/auth";

export function useRegister() {
  return useMutation({
    mutationFn: async (info: RegisterInfo) => {
      const { data: signupData } = await authApi.post<AuthResponse>("/signup", {
        email: info.email,
        password: info.password,
      });

      await api.post(
        "/profiles",
        {
          id: signupData.user.id,
          organization_id: info.organization_id,
          name: info.name,
          role: "user",
          is_active: false,
        },
        { headers: { Authorization: `Bearer ${signupData.access_token}` } },
      );

      return signupData;
    },
  });
}
