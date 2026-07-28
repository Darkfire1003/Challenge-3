import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useSuggestBeverage() {
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => {
      await api.post(
        "/rpc/add_beverage_suggestion",
        { name, description },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    },
  });
}
