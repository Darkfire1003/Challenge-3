import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useAddOrganizationAdmin() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      profileId,
      organizationId,
    }: {
      profileId: string;
      organizationId: string;
    }) => {
      const { data } = await api.patch(
        `/profiles?id=eq.${profileId}`,
        { organization_id: organizationId, role: "org_admin" },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["organization-admins", variables.organizationId],
      });
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
}
