import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export type ProfileWithOrg = {
  id: string;
  name: string;
  role: "admin" | "org_admin" | "user";
  organization_id: string | null;
  is_active: boolean;
  credits: number;
  organizations?: { name: string } | null;
};

export function useGetAllProfiles() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["profiles", "all-with-org"],
    queryFn: async () => {
      const { data } = await api.post<ProfileWithOrg[]>(
        `/rpc/get_all_profiles_with_organization`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      return data;
    },
    enabled: Boolean(accessToken),
  });
}
