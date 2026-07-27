import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/app/api/config";
import { RegisterInfo } from "@/types/auth";

export function useRegister() {
  return useMutation({
    mutationFn: async (info: RegisterInfo) => {
      const { data } = await authApi.post("/signup", {
        email: info.email,
        password: info.password,
        data: {
          name: info.name,
          organization_id: info.organization_id,
        },
      });
      return data;
    },
  });
}
