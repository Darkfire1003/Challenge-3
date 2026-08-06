// -- useGetBeverages.ts --
// React Hook zum Laden der Getränkedaten aus Supabase.
// Zweck:
// - Liefert die Liste aller Getränke aus der Supabase-Tabelle "beverages".
// - Nutzt react-query useQuery für Caching und Aktualisierungen.
// - Die Abfrage ist nur aktiv, wenn ein accessToken vorhanden ist (enabled flag).
// Rückgabe: Beverage[]
// Hinweis: Die Hook benötigt ein gültiges accessToken, das im Authorization-Header
// mitgesendet wird (hier als Platzhalter dargestellt).
import { useQuery } from "@tanstack/react-query";
import { api, Beverage } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useGetBeverages() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["beverages"],
    queryFn: async () => {
      // Ruft die Liste der Getränke aus Supabase ab.
      // Diese Abfrage wird nur ausgeführt, wenn ein accessToken vorhanden ist.
      const { data } = await api.get<Beverage[]>("/beverages", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    },
    enabled: !!accessToken,
  });
}
