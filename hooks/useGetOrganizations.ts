// -- useGetOrganizations.ts --
// React Hook zum Laden der Organisationen aus der Supabase-Datenbank.
// Zweck:
// - Liefert die Liste aller Organisationen für Auswahlfelder (z.B. Registrierungsformular).
// Rückgabe: Organization[]
// Laufzeit: clientseitig via react-query; ruft die Supabase-REST-API ab.
// Hinweis: Keine Auth-Header nötig, falls die Tabelle öffentlich lesbar ist; sonst
// muss ein Authorization-Header ergänzt werden.
import { useQuery } from "@tanstack/react-query";
import { api, Organization } from "@/app/api/config";

export function useGetOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      // Ruft die Organizations-Tabelle aus Supabase ab.
      // Diese Organisationsdaten werden im Registerformular als Auswahl angezeigt.
      const { data } = await api.get<Organization[]>("/organizations");
      return data;
    },
  });
}
