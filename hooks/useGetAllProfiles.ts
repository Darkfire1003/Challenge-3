import { useQuery } from "@tanstack/react-query";
import { api, Profile } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useGetAllProfiles() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data } = await api.get<Profile[]>(`/profiles`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    },
    enabled: !!accessToken,
  });
}
