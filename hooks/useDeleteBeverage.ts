import { useMutation, useQueryClient } from "@tanstack/react-query"; // useMutation = für Aktionen die was löschen/ändern
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext"; // Um an das Login Token zu kommen

export function useDeleteBeverage() {
  const queryClient = useQueryClient(); // Cache Manager - weiß welche Daten gerade angezeigt werden
  const { accessToken } = useAuth();

  return useMutation({
    // WAS PASSIERT WENN man .mutate(id) AUFRUFT?
    mutationFn: async (id: string) => {
      // id = z.B. "bev-123" - ID des Getränks das gelöscht werden soll
      // kommt aus: deleteBeverage.mutate(b.id)

      const { data } = await api.delete(`/beverages?id=eq.${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }, // Ausweis vorzeigen
      });
      // DELETE /beverages?id=eq.bev-123 = übersetzt: DELETE FROM beverages WHERE id = 'bev-123'

      return data; // Gibt zurück was Supabase zurückgibt (meist leeres Array)
    },

    // WENN LÖSCHEN GEKLAPPT HAT
    onSuccess: () => {
      // Sag React Query: Die Liste "beverages" ist jetzt alt, lade neu!
      // Dadurch verschwindet das Getränk sofort aus der UI
      queryClient.invalidateQueries({ queryKey: ["beverages"] });
    },

    // WENN LÖSCHEN SCHIEF GEHT
    onError: (error: any) => {
      // error.response?.data = Was Supabase als Fehler zurückgibt
      const code = error.response?.data?.code; // z.B. "23503"
      const details = error.response?.data?.details; // Mehr Infos zum Fehler

      console.error("Delete Fehler:", code, details); // In Browser Konsole loggen zum Debuggen

      // Spezialfall: Foreign Key Fehler
      // Code 23503 = In Postgres "foreign_key_violation"
      // Heißt: Dieses Getränk steckt schon in einer anderen Tabelle (z.B. purchases/orders)
      // Dann darf man es nicht löschen, sonst wären alte Käufe kaputt
      if (code === "23503") {
        alert(
          "Kann nicht gelöscht werden – dieses Getränk wurde schon gekauft, bitte stattdessen deaktivieren.",
        );
      } else {
        // Jeder andere Fehler
        alert(
          "Löschen fehlgeschlagen: " + (error.message || "Unbekannter Fehler"),
        );
      }
    },
  });
}
