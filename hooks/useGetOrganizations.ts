import { useQuery } from "@tanstack/react-query";
import { api, Organization } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useGetOrganizations() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data } = await api.get<Organization[]>("/organizations", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    },
    enabled: !!accessToken,
  });
}
