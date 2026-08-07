// -- useGetProfile.ts --
// React Hook, um das Benutzerprofil aus der Supabase REST API zu laden.
// Zweck:
// - Prüft, ob für eine gegebene Supabase-User-ID bereits ein Profil in der
//   Tabelle "profiles" existiert.
// - Wird typischerweise direkt nach erfolgreichem Auth-Login verwendet, um
//   Rolle, Aktivierungsstatus und weitere Profilfelder abzurufen.
// Eingaben: { userId: string; accessToken: string }
// Rückgabe: Profile | undefined (erstes Profil-Objekt, falls vorhanden)
// Hinweis: Diese Hook ruft die serverseitige Supabase-REST-API auf und erwartet
// einen Authorization-Header (hier als Platzhalter dargestellt).
import { useMutation } from "@tanstack/react-query";
import { api, Profile } from "@/app/api/config";

// React Hook für das Laden eines Nutzerprofils aus Supabase.
// Diese Hook wird im Login-Prozess aufgerufen, um zu prüfen,
// ob bereits ein Profil existiert und welche Rolle/Aktivierung vorliegt.
export function useGetProfile() {
  return useMutation({
    mutationFn: async ({
      userId,
      accessToken,
    }: {
      userId: string;
      accessToken: string;
    }) => {
      const { data } = await api.get<Profile[]>(`/profiles?id=eq.${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data[0];
    },
  });
}
