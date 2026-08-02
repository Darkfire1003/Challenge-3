import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";
import { UpdateOrganization } from "@/types/organizations";

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (payload: UpdateOrganization) => {
      const { id, ...rest } = payload;
      const { data } = await api.patch(`/organizations?id=eq.${id}`, rest, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
