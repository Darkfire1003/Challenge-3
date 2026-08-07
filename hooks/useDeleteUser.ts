import { useMutation, useQueryClient } from "@tanstack/react-query"; // useMutation = für Aktionen die was in DB verändern/löschen
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext"; // Holt  Login Token

export function useDeleteUser() {
  const queryClient = useQueryClient(); // Cache Manager - merkt sich alle User die schon geladen wurden
  const { accessToken } = useAuth(); // JWT Token = euer Ausweis, ohne darf man nicht  löschen

  return useMutation({
    //  LÖSCHEN
    mutationFn: async (profileId: string) => {
      // profileId = z.B. "user-abc-123" - Welcher User soll komplett gelöscht werden?
      // Aufruf mit: deleteUser.mutate(user.id)

      // Hier nutzt ich KEIN normales DELETE, sondern eine Postgres Funktion (RPC)
      // Warum RPC? Weil löschen kompliziert ist:
      // ichh will einen User + seine Notifications + evtl. Auth User löschen
      // Das geht nicht mit einem einfachen DELETE, deswegen habe ich in Supabase
      // eine Funktion delete_user_with_notifications geschrieben
      const { data } = await api.post(
        `/rpc/delete_user_with_notifications`, // Ruft die DB Funktion auf: SELECT delete_user_with_notifications(...)
        { target_user_id: profileId }, // Parameter für die Funktion: Welcher User?
        { headers: { Authorization: `Bearer ${accessToken}` } }, // Ausweis zeigen, sonst 401
      );
      return data; // Was die Funktion zurückgibt (z.B. true / success)
    },

    //  NACH ERFOLG?
    onSuccess: () => {
      // Key ["org-users"] = da liegen die User Listen drin (aus useGetOrganizationUsers)

      // Als veraltet markieren - wird beim nächsten Anzeigen neu geladen
      queryClient.invalidateQueries({ queryKey: ["org-users"] });

      //  SOFORT neu laden, nicht erst warten bis man wieder auf die Seite geht
      // invalidate = "ist alt", refetch = "lade JETZT neu"

      queryClient.refetchQueries({ queryKey: ["org-users"] });
    },
  });
}
