import { useQuery } from "@tanstack/react-query"; // useQuery = Hook zum Daten LADEN (nicht ändern)
import { api, Profile } from "@/app/api/config"; // api = Supabase Verbindung, Profile = User Typ
import { useAuth } from "@/app/context/AuthContext"; // Holt das Login Token

export function useGetOrganizationUsers(organizationId: string | null) {
  const { accessToken } = useAuth(); //Ausweis für Supabase

  return useQuery({
    // CACHE KEY
    queryKey: ["org-users", organizationId], // Pro Org ein eigener Cache Eintrag
    // ["org-users", "org-1"] = User aus Org 1, ["org-users", "org-2"] = User aus Org 2
    // Wenn ich invalidateQueries(["org-users", "org-1"]) mache, wird nur Org 1 neu geladen

    // WIE WERDEN DATEN GEHOLT?
    queryFn: async () => {
      const { data } = await api.get<Profile[]>(
        // URL: /profiles?organization_id=eq.org-123
        // SQL Übersetzung: SELECT * FROM profiles WHERE organization_id = 'org-123'
        // Heißt: Gib mir ALLE User (egal ob user / org_admin) die zu dieser Org gehören
        `/profiles?organization_id=eq.${organizationId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }, // Token mitschicken sonst 401
        },
      );
      return data; // z.B. [{id: "u1", name: "Max", credits: 10}, {id: "u2"...}]
    },

    //WANN  LADEN?
    enabled: Boolean(accessToken) && Boolean(organizationId),
    // accessToken muss da sein = User ist eingeloggt
    // organizationId muss da sein = Wir wissen welche Org
    // organizationId ist string | null -> wenn null (z.B. noch am Laden) -> gar nicht erst versuchen
    // Verhindert Request wie /profiles?organization_id=eq.null was kaputt wäre
  });
}
