import { useMutation, useQueryClient } from "@tanstack/react-query"; // useMutation = Hook für alles was löscht / schreibt
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext"; // Holt das eingeloggte User Token

export function useDeleteOrganization() {
  const queryClient = useQueryClient(); // Der Zwischenspeicher von TanStack Query - da liegen alle geladenen Orgs drin
  const { accessToken } = useAuth();
  return useMutation({
    //  LÖSCH-AKTION
    mutationFn: async (id: string) => {
      // id = z.B. "org-99" - welche Org soll weg?
      // Wird aufgerufen mit: deleteItem.mutate(item.id)

      const { data } = await api.delete(`/organizations?id=eq.${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }, //ausweiskontrolle
      });
      // Das bedeutet für Supabase / Postgres:
      // DELETE FROM organizations WHERE id = 'org-99'
      // id=eq.id ist PostgREST Schreibweise für "wo id gleich ist"

      return data;
    },

    // WENN ES GEKLAPPT HAT
    onSuccess: () => {
      //DIe Liste mit Key ["organizations"] ist veraltet!
      // Bitte lade sie neu von Supabase
      // Dadurch verschwindet die gelöschte Org sofort aus der UI ohne Seite neu laden
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },

    // WENN ES SCHIEF GEHT
    onError: (error: any) => {
      // error = Was Axios/Supabase zurückwirft
      const code = error.response?.data?.code; // z.B. "23503"

      // Code 23503 = Postgres Fehler "foreign_key_violation"
      // Diese Org wird noch woanders benutzt!
      // z.B. es gibt noch User mit organization_id = diese Org
      // oder Getränke / Käufe die zu dieser Org gehören
      // Postgres verbietet dann das Löschen, sonst hättet ihr verwaiste Daten
      if (code === "23503") {
        alert(
          "Organisation kann nicht gelöscht werden, da noch Daten mit ihr verknüpft sind, bitte an den DB-Admin wenden.",
        );
      } else {
        // Jeder andere Fehler, z.B. kein Internet, kein Recht, Token abgelaufen
        alert("Löschen fehlgeschlagen: " + error.message);
      }
    },
  });
}
