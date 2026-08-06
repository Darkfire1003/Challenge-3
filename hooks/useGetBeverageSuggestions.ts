import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";
import { BeverageSuggestion } from "@/types/orgAdmin";

export function useGetBeverageSuggestions(organizationId: string | null) {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["beverage-suggestions", organizationId],
    queryFn: async () => {
      const filter = organizationId
        ? `&organization_id=eq.${organizationId}`
        : "";
      const { data } = await api.get<BeverageSuggestion[]>(
        `/beverage_suggestions?status=eq.pending${filter}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      return data;
    },
    enabled: Boolean(accessToken),
  });
}
