import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/organizations?id=eq.${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error: any) => {
      const code = error.response?.data?.code;
      const details = error.response?.data?.details;

      if (code === "23503") {
        alert(
          "Organisation kann nicht gelöscht werden, da noch Daten mit ihr verknüpft sind, bitte an den DB-Admin wenden.",
        );
      } else {
        alert("Löschen fehlgeschlagen: " + error.message);
      }
    },
  });
}
