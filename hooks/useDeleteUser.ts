import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (profileId: string) => {
      const { data } = await api.post(
        `/rpc/delete_user_with_notifications`,
        { target_user_id: profileId },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-users"] });
      queryClient.refetchQueries({ queryKey: ["org-users"] });
    },
  });
}
