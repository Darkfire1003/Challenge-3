import { useQuery } from "@tanstack/react-query";
import { api, ProfileWithOrganization } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useProfile() {
  const { accessToken, userId } = useAuth();

  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data } = await api.get<ProfileWithOrganization[]>(
        `/profiles?id=eq.${userId}&select=*,organizations(name)`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      return data[0];
    },
    enabled: Boolean(accessToken) && Boolean(userId),
  });
}
