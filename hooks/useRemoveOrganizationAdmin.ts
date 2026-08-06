import { useMutation, useQueryClient } from "@tanstack/react-query"; // useMutation = zum Ändern von Daten
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useRemoveOrganizationAdmin() {
  const queryClient = useQueryClient(); // Cache Manager - weiß wo alle User/Admin Listen liegen
  const { accessToken } = useAuth(); //Ausweis für Supabase

  return useMutation({
    // WAS PASSIERT WENN IHR AUF "ADMIN ENTFERNEN" KLICKT?
    mutationFn: async ({ profileId }: { profileId: string }) => {
      // profileId = z.B. "user-123" = Welcher User soll degradiert werden?
      // Aufruf: removeAdmin.mutate({ profileId: user.id })

      const { data } = await api.patch(
        // PATCH = UPDATE
        `/profiles?id=eq.${profileId}`, // WHERE id = profileId
        { role: "user" }, // SET role = 'user' -> von org_admin zurück zu normalem user
        {
          headers: { Authorization: `Bearer ${accessToken}` }, // Ausweis zeigen
        },
      );
      // SQL Übersetzung: UPDATE profiles SET role = 'user' WHERE id = 'user-123'
      // ich lösche den User NICHT, ihc nehme ihm nur die Admin Rechte weg

      return data;
    },

    // 2. NACH DEM ERFOLG - UI UPDATEN
    onSuccess: () => {
      // a) Liste der Org-Admins ist alt -> neu laden -> User verschwindet aus Admin Liste
      queryClient.invalidateQueries({ queryKey: ["organization-admins"] });

      // b) Globale Profil Liste ist auch alt -> neu laden
      // Wichtig weil der User ja noch in ["profiles", "all-with-org"] steckt
      // Da soll sich seine Rolle auch von org_admin auf user ändern
      queryClient.invalidateQueries({ queryKey: ["profiles"] });

      // Optional würde man hier auch noch ["org-users", orgId] invalidaten wenn ihr das anzeigt
    },
  });
}
