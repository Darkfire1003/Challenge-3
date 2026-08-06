import { useQuery } from "@tanstack/react-query";
import { api, Profile } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useGetOrganizationAdmins(organizationId: string) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["organization-admins", organizationId],
    queryFn: async () => {
      const { data } = await api.get<Profile[]>(
        `/profiles?organization_id=eq.${organizationId}&role=eq.org_admin`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return data;
    },
    enabled: Boolean(accessToken) && Boolean(organizationId),
  });
}
