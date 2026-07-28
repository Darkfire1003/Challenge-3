import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useBuyBeverage() {
  const queryClient = useQueryClient();
  const { accessToken, userId } = useAuth();

  return useMutation({
    mutationFn: async ({
      beverageId,
      amount = 1,
    }: {
      beverageId: string;
      amount?: number;
    }) => {
      await api.post(
        "/rpc/buy_beverage",
        { p_beverage_id: beverageId, p_amount: amount },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beverages"] });
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}
