import { useQuery } from "@tanstack/react-query"; // useQuery = nur zum LESEN von Daten
import { api, Profile } from "@/app/api/config"; // api = Supabase Verbindung, Profile = Typ für User
import { useAuth } from "@/app/context/AuthContext"; // Holt das Token

export function useGetOrganizationAdmins(organizationId: string) {
  const { accessToken } = useAuth(); // Ausweis für Supabase

  return useQuery({
    // CACHE KEY
    queryKey: ["organization-admins", organizationId], // Pro Org eigener Cache
    // ["organization-admins", "org-1"] und ["organization-admins", "org-2"] sind getrennt
    // Deswegen kann man eine einzelne Org invalidaten ohne alle zu laden

    // WIE LADEN?
    queryFn: async () => {
      const { data } = await api.get<Profile[]>(
        // URL: /profiles?organization_id=eq.org-123&role=eq.org_admin
        // In SQL übersetzt:
        // SELECT * FROM profiles
        // WHERE organization_id = 'org-123'
        // AND role = 'org_admin'
        // Heißt: Gib mir alle User die Org-Admins dieser einen Org sind
        `/profiles?organization_id=eq.${organizationId}&role=eq.org_admin`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }, // Ohne Token = 401
        },
      );
      return data; // z.B. [{id: "u1", name: "Max", role: "org_admin"}, {id: "u2", name: "Anna"...}]
    },

    // WANN LADEN?
    enabled: Boolean(accessToken) && Boolean(organizationId),
    // Nur laden wenn BEIDES da ist:
    // a) Token existiert = User ist eingeloggt
    // b) organizationId existiert = Wir wissen für welche Org wir suchen
    // Wenn ich das ohne organizationId aufrufen würdet, wäre URL kaputt -> deswegen hier blocken
  });
}
