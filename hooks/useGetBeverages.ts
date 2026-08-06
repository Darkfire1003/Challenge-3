import { useQuery } from "@tanstack/react-query";
import { api, Beverage } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useGetBeverages() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["beverages"],
    queryFn: async () => {
      const { data } = await api.get<Beverage[]>("/beverages", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    },
    enabled: Boolean(accessToken),
  });
}
