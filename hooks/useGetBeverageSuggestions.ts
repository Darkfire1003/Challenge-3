import { useQuery } from "@tanstack/react-query"; // useQuery = zum Lesen / Laden von Daten
import { api } from "@/app/api/config"; //  Supabase Verbindung
import { useAuth } from "@/app/context/AuthContext"; // Holt das Login Token
import { BeverageSuggestion } from "@/types/orgAdmin"; // Typ wie ein Vorschlag aussieht: name, price, user etc.

export function useGetBeverageSuggestions(organizationId: string | null) {
  const { accessToken } = useAuth(); //  Ausweis

  return useQuery({
    // CACHE KEY
    queryKey: ["beverage-suggestions", organizationId], // Wichtig: Mit organizationId!
    // Heißt: Für jede Org ein eigener Cache.
    // ["beverage-suggestions", "org-1"] und ["beverage-suggestions", "org-2"] sind 2 verschiedene Caches
    // Und ["beverage-suggestions", null] = für Admin der alle sieht

    //  WIE LADEN?
    queryFn: async () => {
      // Baue Filter String zusammen
      const filter = organizationId
        ? `&organization_id=eq.${organizationId}` // Wenn org_admin eingeloggt ist: nur seine Org
        : ""; // Wenn globaler admin (organizationId = null): keinen Org Filter = alle Orgs

      const { data } = await api.get<BeverageSuggestion[]>(
        // URL Bau: /beverage_suggestions?status=eq.pending&organization_id=eq.org-123
        // Übersetzt in SQL: SELECT * FROM beverage_suggestions WHERE status = 'pending' AND organization_id = 'org-123'
        // Ohne Org Filter: SELECT * WHERE status = 'pending' (alle)
        `/beverage_suggestions?status=eq.pending${filter}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }, // Token mitschicken
      );
      return data; // z.B. [{name: "Mate", status: "pending", organization_id: "org-1"}, ...]
    },

    enabled: Boolean(accessToken), // Nur laden wenn eingeloggt, sonst 401 vermeiden
  });
}
