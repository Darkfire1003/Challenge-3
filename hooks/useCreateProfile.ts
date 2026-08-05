import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/api/config";

export function useCreateProfile() {
  return useMutation({
    mutationFn: async ({
      userId,
      accessToken,
      name,
      organizationId,
    }: {
      userId: string;
      accessToken: string;
      name: string;
      organizationId: string;
    }) => {
      await api.post(
        "/profiles",
        {
          id: userId,
          name,
          organization_id: organizationId,
          role: "user",
          is_active: false,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    },
  });
}
