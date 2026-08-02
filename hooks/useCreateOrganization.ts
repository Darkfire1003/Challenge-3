import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Organization } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";
import { NewOrganization } from "@/types/organizations";

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (payload: NewOrganization) => {
      const { data } = await api.post<Organization>("/organizations", payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
