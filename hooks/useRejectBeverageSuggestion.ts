import { useMutation, useQueryClient } from "@tanstack/react-query"; // useMutation = für Aktionen die DB ändern (POST, PATCH, DELETE)
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext"; // Holt das eingeloggte JWT Token

export function useRejectBeverageSuggestion() {
  const queryClient = useQueryClient(); // Zugriff auf den React Query Cache
  const { accessToken } = useAuth(); // JWT Token = Ausweis

  return useMutation({
    // WAS PASSIERT BEIM KLICK AUF ABLEHNEN
    mutationFn: async (suggestionId: string) => {
      // suggestionId kommt aus: rejectSuggestion.mutate("sug-123")

      await api.patch(
        // PATCH = UPDATE in PostgREST Sprache
        `/beverage_suggestions?id=eq.${suggestionId}`, // WHERE id = suggestionId
        { status: "rejected" }, // SET status = 'rejected'
        { headers: { Authorization: `Bearer ${accessToken}` } }, // Auth Header
      );
      // In SQL: UPDATE beverage_suggestions SET status = 'rejected' WHERE id = 'sug-123'
    },

    // WAS PASSIERT DANACH IN DER UI
    onSuccess: () => {
      // React Query: Alle Queries die mit ["beverage-suggestions"] anfangen sind alt
      // z.B. ["beverage-suggestions", "org-123"] wird neu geladen
      // Dadurch verschwindet der Vorschlag sofort aus der Pending Liste
      queryClient.invalidateQueries({ queryKey: ["beverage-suggestions"] });
    },
  });
}
