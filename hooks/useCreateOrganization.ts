import { useMutation, useQueryClient } from "@tanstack/react-query"; // useMutation = für schreibende Aktionen (POST, PATCH, DELETE)
import { api, Organization } from "@/app/api/config"; // api =  Supabase Verbindung
import { useAuth } from "@/app/context/AuthContext"; // Holt euer Login Token
import { NewOrganization } from "@/types/organizations"; // Typ: Was man zum Erstellen braucht (name, address)

export function useCreateOrganization() {
  const queryClient = useQueryClient(); // Der Cache Speicher von React Query
  const { accessToken } = useAuth();

  return useMutation({
    // BEIM KLICK AUF "Erstellen"
    mutationFn: async (payload: NewOrganization) => {
      // payload = z.B. { name: "Büro Wien", address: "Hauptstr. 1" }
      // Kommt aus  handleCreate: createItem.mutate({name, address})

      const { data } = await api.post<Organization>("/organizations", payload, {
        headers: { Authorization: `Bearer ${accessToken}` }, // Ohne Token sagt Supabase 401 = kein Zutritt
      });
      // POST = INSERT = Neue Zeile in Tabelle organizations erstellen
      // <Organization> = TypeScript: data ist danach eine fertige Org mit id, created_at etc.

      return data; // Gibt die neu erstellte Org zurück
    },

    // NACH DEM ERFOLG?
    onSuccess: () => {
      // Alle Listen mit dem Key ["organizations"] sind jetzt veraltet
      // useGetOrganizations() wird automatisch neu ausgeführt
      // Dadurch taucht die neue Org sofort in der UI auf ohne Reload
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
