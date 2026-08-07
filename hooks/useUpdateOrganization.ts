import { useMutation, useQueryClient } from "@tanstack/react-query"; // useMutation = für ändern/löschen/schreiben
import { api } from "@/app/api/config"; //  Supabase Verbindung
import { useAuth } from "@/app/context/AuthContext"; // Holt das Token
import { UpdateOrganization } from "@/types/organizations"; // Typ: {id: string, name?: string, ...}

export function useUpdateOrganization() {
  const queryClient = useQueryClient(); // Cache Manager
  const { accessToken } = useAuth(); // JWT Token = Ausweis

  return useMutation({
    // UPDATEN
    mutationFn: async (payload: UpdateOrganization) => {
      // payload kommt so rein: {id: "org-123", name: "Neuer Name", ...}
      // Aufruf: updateOrg.mutate({id: "org-123", name: "Büro Wien NEU"})

      const { id, ...rest } = payload; // Trick zum Trennen
      // id = "org-123" -> kommt in die URL (welche Org?)
      // rest = {name: "Neuer Name"} -> kommt in den Body (was ändern?)

      const { data } = await api.patch(
        `/organizations?id=eq.${id}`, // WHERE id = 'org-123'
        rest, // SET name = 'Neuer Name' (alles was in rest drin ist)
        {
          headers: { Authorization: `Bearer ${accessToken}` }, // Ausweis
        },
      );
      // SQL: UPDATE organizations SET name = 'Neuer Name' WHERE id = 'org-123'
      return data;
    },

    // 2. NACH ERFOLG
    onSuccess: () => {
      // Liste aller Orgs ist veraltet -> neu laden -> neuer Name erscheint sofort in UI
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
