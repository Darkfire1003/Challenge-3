import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useDeleteBeverage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/beverages?id=eq.${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beverages"] });
    },
  });
}
