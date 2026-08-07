import { useMutation, useQueryClient } from "@tanstack/react-query"; // useMutation = Für Aktionen die was verändern (PATCH/POST/DELETE)
import { api } from "@/app/api/config"; //axios/fetch Instanz die auf Supabase zeigt
import { useAuth } from "@/app/context/AuthContext"; // Um an das accessToken zu kommen

export function useActivateUser() {
  const queryClient = useQueryClient(); // Cache Manager von TanStack
  const { accessToken } = useAuth(); // JWT Token, damit Supabase mich reinlässt

  return useMutation({
    // .mutate() aufrufen
    mutationFn: async (profileId: string) => {
      // profileId = z.B. "abc-123" -> ID des Users der freigeschaltet werden soll

      const { data } = await api.patch(
        `/profiles?id=eq.${profileId}`, // URL: UPDATE profiles WHERE id = profileId
        { is_active: true }, // Was geändert wird: Setze is_active von false auf true
        { headers: { Authorization: `Bearer ${accessToken}` } }, // Auth Header, ohne den sagt Supabase "401 Unauthorized"
      );
      return data; // Gib das Ergebnis zurück
    },

    //  WAS PASSIERT NACH ERFOLG?
    onSuccess: () => {
      // Sag TanStack: Alle Queries mit Key ["org-users"] sind jetzt veraltet, lade sie neu
      // Dadurch verschwindet das "⏳ wartet" und wird zu "✅" ohne Reload
      queryClient.invalidateQueries({ queryKey: ["org-users"] });
    },
  });
}
