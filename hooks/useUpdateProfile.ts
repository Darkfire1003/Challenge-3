// -- useUpdateProfile.ts --
// React Hook zum Aktualisieren des aktuellen Nutzerprofils in Supabase.
// Zweck:
// - Aktualisiert Felder wie name und avatar_path des aktuellen Nutzers.
// - Invalidiert danach das Profil-Query, sodass die UI die neuen Werte anzeigt.
// Eingaben: update: { name?: string; avatar_path?: string }
// Laufzeit: clientseitig; führt ein PATCH auf die /profiles-Tabelle aus und benötigt
// ein gültiges accessToken im Authorization-Header.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { accessToken, userId } = useAuth();

  return useMutation({
    mutationFn: async (update: { name?: string; avatar_path?: string }) => {
      // Patcht das Profil des aktuellen Nutzers in Supabase.
      // Diese Hook wird vom ProfileEditModal genutzt, um Änderungsdaten zu speichern.
      await api.patch(`/profiles?id=eq.${userId}`, update, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}
