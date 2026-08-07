import { useMutation, useQueryClient } from "@tanstack/react-query"; // useMutation = zum ÄNDERN von Daten, nicht Lesen
import { api, UpdateBeverage } from "@/app/api/config"; // api = Supabase, UpdateBeverage = Typ {id, name?, price?, stock?...}
import { useAuth } from "@/app/context/AuthContext"; // Holt Token

export function useUpdateBeverage() {
  const queryClient = useQueryClient(); // Cache Manager - weiß wo ["beverages"] liegt
  const { accessToken } = useAuth(); // JWT Token = Ausweis

  return useMutation({
    // 1. WAS WIRD GEÄNDERT?
    mutationFn: async (payload: UpdateBeverage) => {
      // payload kommt z.B. so: {id: "bev-123", price: 2.50, stock: 20}
      // Aufruf: updateBeverage.mutate({id: "bev-123", price: 2.50})

      const { id, ...rest } = payload; // ID abtrennen
      // id = "bev-123" -> Welche Getränke Zeile?
      // rest = {price: 2.50, stock: 20} -> Was soll neu sein?

      const { data } = await api.patch(
        `/beverages?id=eq.${id}`, // WHERE id = 'bev-123'
        rest, // SET price = 2.50, stock = 20 (alles was in rest ist)
        {
          headers: { Authorization: `Bearer ${accessToken}` }, // Token sonst 401
        },
      );
      // SQL: UPDATE beverages SET price = 2.50, stock = 20 WHERE id = 'bev-123'
      return data;
    },

    // NACH ERFOLG UI UPDATEN
    onSuccess: () => {
      // Alle Queries mit Key ["beverages"] sind jetzt alt -> neu laden
      // Dadurch sieht man neuen Preis/Bestand sofort ohne Seite neu zu laden
      queryClient.invalidateQueries({ queryKey: ["beverages"] });
    },
  });
}
