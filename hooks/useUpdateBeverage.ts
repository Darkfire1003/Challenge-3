import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, UpdateBeverage } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useUpdateBeverage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (payload: UpdateBeverage) => {
      const { id, ...rest } = payload;
      const { data } = await api.patch(`/beverages?id=eq.${id}`, rest, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beverages"] });
    },
  });
}
