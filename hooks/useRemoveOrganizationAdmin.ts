import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useRemoveOrganizationAdmin() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async ({ profileId }: { profileId: string }) => {
      const { data } = await api.patch(
        `/profiles?id=eq.${profileId}`,
        { role: "user" },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-admins"] });
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
}
