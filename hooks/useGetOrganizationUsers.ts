import { useQuery } from "@tanstack/react-query";
import { api, Profile } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useGetOrganizationUsers(organizationId: string | null) {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["org-users", organizationId],
    queryFn: async () => {
      const { data } = await api.get<Profile[]>(
        `/profiles?organization_id=eq.${organizationId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      return data;
    },
    enabled: Boolean(accessToken) && Boolean(organizationId),
  });
}
