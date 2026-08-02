import { useQuery } from "@tanstack/react-query";
import { api, Organization } from "@/app/api/config";

export function useGetOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data } = await api.get<Organization[]>("/organizations");
      return data;
    },
  });
}
