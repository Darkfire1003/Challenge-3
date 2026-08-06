import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useDeleteBeverage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/beverages?id=eq.${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beverages"] });
    },
    onError: (error: any) => {
      const code = error.response?.data?.code;
      const details = error.response?.data?.details;

      console.error("Delete Fehler:", code, details);

      if (code === "23503") {
        alert(
          "Kann nicht gelöscht werden – dieses Getränk wurde schon gekauft, bitte stattdessen deaktivieren.",
        );
      } else {
        alert(
          "Löschen fehlgeschlagen: " + (error.message || "Unbekannter Fehler"),
        );
      }
    },
  });
}
