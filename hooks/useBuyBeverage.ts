// -- useBuyBeverage.ts --
// React Hook für den Kauf eines Getränks über einen Supabase RPC-Endpunkt.
// Zweck:
// - Führt eine serverseitige Transaktion über das RPC /rpc/buy_beverage aus.
// - Nach erfolgreichem Kauf werden relevante Queries invalidiert, damit
//   die UI (Getränkeliste, Profil-Guthaben) aktuelle Werte anzeigt.
// Eingaben: { beverageId: string; amount?: number }
// Rückgabe: void (Mutation). Fehler werden über react-query zur Verfügung gestellt.
// Laufzeit/Ort: clientseitig; die Hook ruft die Supabase REST-API auf (Authorization-Header benötigt).
// Rolle im Datenfluss:
// - Nutzeraktion in der UI -> useBuyBeverage.mutate -> Supabase RPC -> onSuccess invalidiert Queries
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useBuyBeverage() {
  const queryClient = useQueryClient();
  const { accessToken, userId } = useAuth();

  return useMutation({
    mutationFn: async ({
      beverageId,
      amount = 1,
    }: {
      beverageId: string;
      amount?: number;
    }) => {
      // Führt den RPC-Aufruf aus, der in Supabase die Getränkebestellung verarbeitet.
      // Nach erfolgreichem Kauf werden Getränke- und Profilabfragen invalidiert,
      // damit die UI die aktualisierten Werte anzeigt.
      await api.post(
        "/rpc/buy_beverage",
        { p_beverage_id: beverageId, p_amount: amount },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beverages"] });
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}
