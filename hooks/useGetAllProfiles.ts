import { useQuery } from "@tanstack/react-query"; // useQuery = Hook zum LESEN von Daten (GET)
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext"; // Holt das Login Token

// Wie sieht ein User aus der aus DB kommt?
export type ProfileWithOrg = {
  id: string; // z.B. "user-123"
  name: string; // z.B. "Max"
  role: "admin" | "org_admin" | "user"; // Nur diese 3 Rollen sind erlaubt
  organization_id: string | null; // Zu welcher Org gehört er? null = keine Org
  is_active: boolean; // true = freigeschaltet, false = wartet noch
  credits: number; // Guthaben
  organizations?: { name: string } | null; // Wenn JOIN gemacht wurde, kommt hier {name: "Büro Wien"} mit
};

export function useGetAllProfiles() {
  const { accessToken } = useAuth(); // Ausweis für Supabase

  return useQuery({
    //  Wie merkt sich React Query diese Daten?
    queryKey: ["profiles", "all-with-org"], // Wie ein Ordner Name. Damit findet invalidateQueries diese Daten wieder
    // ["profiles"] = alle Profil Listen, ["all-with-org"] = speziell die mit Orga Namen

    // WAS SOLL GELADEN WERDEN?
    queryFn: async () => {
      // ich rufe wieder eine eigene Postgres Funktion auf (RPC), kein normales GET
      // Warum? Weil ich profiles + organizations zusammen brauche (JOIN)

      const { data } = await api.post<ProfileWithOrg[]>( // <ProfileWithOrg[]> = ich erwarte ein Array von diesem Typ zurück
        `/rpc/get_all_profiles_with_organization`, // Name der Funktion in Supabase: get_all_profiles_with_organization()
        {}, // Leeres Objekt = Keine Parameter für die Funktion nötig
        { headers: { Authorization: `Bearer ${accessToken}` } }, // Ausweis mitschicken, sonst 401
      );
      return data; // data = z.B. [{id: "1", name: "Max", organizations: {name: "Wien"}}, ...]
    },

    // WANN SOLL DAS  LADEN?
    enabled: Boolean(accessToken), // Nur ausführen wenn accessToken existiert
    // Boolean("abc") = true, Boolean("") = false, Boolean(null) = false
    // Heißt: Wenn User nicht eingeloggt ist, gar nicht erst versuchen zu laden -> vermeidet Fehler
  });
}
