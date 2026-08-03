import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useActivateUser() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (profileId: string) => {
      const { data } = await api.patch(
        `/profiles?id=eq.${profileId}`,
        { is_active: true },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-users"] });
    },
  });
}
