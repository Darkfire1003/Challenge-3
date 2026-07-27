import { useMutation } from "@tanstack/react-query";
import { api, Profile } from "@/app/api/config";

export function useGetProfile() {
  return useMutation({
    mutationFn: async ({
      userId,
      accessToken,
    }: {
      userId: string;
      accessToken: string;
    }) => {
      const { data } = await api.get<Profile[]>(`/profiles?id=eq.${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data[0];
    },
  });
}
