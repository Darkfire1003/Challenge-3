// -- useProfile.ts --
// React Hook zum Laden des aktuellen Nutzerprofils inklusive zugehöriger Organisationsdaten.
// Zweck:
// - Lädt das Profil des aktuell angemeldeten Nutzers inklusive des zugehörigen
//   Organisationsnamens (mittels select-Parameter).
// Eingaben: Zugriff über useAuth (accessToken, userId). Rückgabe: ProfileWithOrganization | undefined
// Laufzeit: clientseitig; verwendet react-query für Caching und automatisches Refetch.
// Sicherheit: Die Anfrage sendet einen Authorization-Header (Platzhalter im Code).
import { useQuery } from "@tanstack/react-query";
import { api, ProfileWithOrganization } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useProfile() {
  const { accessToken, userId } = useAuth();

  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      // Lädt das aktive Profil des angemeldeten Nutzers.
      // Der select-Parameter ergänzt die Daten um den Organisationsnamen.
      const { data } = await api.get<ProfileWithOrganization[]>(
        `/profiles?id=eq.${userId}&select=*,organizations(name)`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      return data[0];
    },
    enabled: !!accessToken && !!userId,
  });
}
