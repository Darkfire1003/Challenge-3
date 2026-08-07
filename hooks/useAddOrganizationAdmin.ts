import { useMutation, useQueryClient } from "@tanstack/react-query"; // useMutation = für alles was in DB schreibt/ändert
import { api } from "@/app/api/config"; //  API Verbindung zu Supabase
import { useAuth } from "@/app/context/AuthContext"; // Holt das Login Token

export function useAddOrganizationAdmin() {
  const queryClient = useQueryClient(); // Der Cache Speicher von TanStack - merkt sich alle geladenen Daten
  const { accessToken } = useAuth(); // Das JWT Token, ohne das sagt Supabase "du darfst nicht"

  return useMutation({
    // Was passiert in der Datenbank?
    mutationFn: async ({
      profileId, // z.B. "user-123" - Wen wollen wir zum Admin machen?
      organizationId, // z.B. "org-99" - Für welche Firma/Organisation?
    }: {
      profileId: string;
      organizationId: string;
    }) => {
      // PATCH = Update = Verändere bestehenden Datensatz
      const { data } = await api.patch(
        `/profiles?id=eq.${profileId}`, // Heißt übersetzt: UPDATE profiles WHERE id = profileId
        {
          organization_id: organizationId, // Setze die Firma auf org-99
          role: "org_admin", // Setze die Rolle von z.B. "user" auf "org_admin"
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }, // Ausweis zeigen, sonst 401 Fehler
        },
      );
      return data;
    },

    // WAS PASSIERT NACH ERFOLG?
    onSuccess: (_data, variables) => {
      // _data = was Supabase zurückgibt, braucht man hier nicht
      // variables = das Objekt von oben {profileId, organizationId}

      // a) Sag TanStack: Die Admin Liste dieser einen Org ist veraltet, lade neu
      // Dadurch taucht der neue Admin sofort in der Liste "Aktuelle Org-Admins" auf
      queryClient.invalidateQueries({
        queryKey: ["organization-admins", variables.organizationId],
      });

      // b) Sag TanStack: Auch die allgemeine User Liste ist veraltet, lade neu
      // Damit sieht man bei dem User sofort "org_admin" statt "user" und "Firma A" statt "keine Org"
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
}
