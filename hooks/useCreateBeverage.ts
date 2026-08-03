import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Beverage, NewBeverage } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useCreateBeverage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (payload: NewBeverage) => {
      const { data } = await api.post<Beverage>("/beverages", payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beverages"] });
    },
  });
}
