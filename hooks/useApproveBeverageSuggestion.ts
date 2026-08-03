import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useApproveBeverageSuggestion() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (suggestionId: string) => {
      try {
        await api.post(
          "/rpc/approve_beverage_suggestion",
          { p_suggestion_id: suggestionId },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      } catch {
        await api.patch(
          `/beverage_suggestions?id=eq.${suggestionId}`,
          { status: "approved" },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beverage-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["beverages"] });
    },
  });
}
