// -- useCreateProfile.ts --
// Hook zum Erzeugen eines neuen Profils in der Supabase-Datenbank.
// Zweck:
// - Legt für eine gegebene Supabase-User-ID einen Profile-Eintrag an.
// - Standardmäßig wird role="user" gesetzt und is_active auf false, sodass
//   ein Organisationsadmin die Freigabe durchführen muss.
// Eingaben: { userId: string; accessToken: string; name: string; organizationId: string }
// Hinweis: Diese Hook führt eine POST-Anfrage an die /profiles-Route der Supabase-API aus
// und erwartet einen Authorization-Header (hier als Platzhalter).
import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/api/config";

export function useCreateProfile() {
  return useMutation({
    mutationFn: async ({
      userId,
      accessToken,
      name,
      organizationId,
    }: {
      userId: string;
      accessToken: string;
      name: string;
      organizationId: string;
    }) => {
      // Erstellt ein neues Profil in der Supabase-Tabelle "profiles".
      // Dabei wird der Benutzer als role="user" angelegt und zunächst als
      // inaktiv markiert, bis ein Organisationsadmin ihn freigibt.
      await api.post(
        "/profiles",
        {
          id: userId,
          name,
          organization_id: organizationId,
          role: "user",
          is_active: false,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    },
  });
}
