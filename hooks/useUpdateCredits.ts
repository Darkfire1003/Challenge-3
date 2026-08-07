// -- useUpdateCredits.ts --
// React Hook zum Aktualisieren des Nutzer-Guthabens in Supabase.
// Zweck:
// - Führt ein PATCH auf das Profil des aktuellen Nutzers aus und aktualisiert das Feld 'credits'.
// - Invalidiert anschließend das Profil-Query, damit UI-Komponenten frische Daten erhalten.
// Eingaben: newCredits: number
// Laufzeit: clientseitig; die Hook ruft die Supabase-REST-API auf und benötigt ein accessToken.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useUpdateCredits() {
  const queryClient = useQueryClient();
  const { accessToken, userId } = useAuth();

  return useMutation({
    mutationFn: async (newCredits: number) => {
      // Führt ein PATCH auf das Profil des aktuellen Nutzers aus.
      // Diese Hook wird vom BudgetManager genutzt, um das Guthaben zu aktualisieren.
      await api.patch(
        `/profiles?id=eq.${userId}`,
        { credits: newCredits },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}
