import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useUpdateCredits() {
  const queryClient = useQueryClient();
  const { accessToken, userId } = useAuth();

  return useMutation({
    mutationFn: async (newCredits: number) => {
      await api.patch(
        `/profiles?id=eq.${userId}`,
        { credits: newCredits },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}
