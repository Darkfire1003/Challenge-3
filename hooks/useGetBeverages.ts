import { useQuery } from "@tanstack/react-query"; // useQuery = Hook nur zum LESEN, nicht zum Schreiben
import { api, Beverage } from "@/app/api/config"; // api = Supabase Verbindung, Beverage = Typ für ein Getränk
import { useAuth } from "@/app/context/AuthContext"; // Holt  Login Token

export function useGetBeverages() {
  const { accessToken } = useAuth(); // Ausweis für Supabase

  return useQuery({
    // CACHE SCHLÜSSEL
    queryKey: ["beverages"], // Wie ein Name/Etikett. React Query merkt sich Daten unter diesem Namen
    // Wenn ich später invalidateQueries({queryKey: ["beverages"]}) mache, weiß es genau welche Liste neu geladen werden muss

    // WIE WERDEN DIE DATEN GEHOLT?
    queryFn: async () => {
      // Einfacher GET Request an die Supabase Tabelle beverages
      const { data } = await api.get<Beverage[]>("/beverages", {
        headers: { Authorization: `Bearer ${accessToken}` }, // Ohne Token, Supabase "401 Unauthorized"
      });
      // /beverages = SELECT * FROM beverages (PostgREST macht automatisch SQL daraus)
      // <Beverage[]> = TypeScript weiß: data ist ein Array von Getränken z.B. [{id, name, price, stock...}]

      return data; // Gibt das Array zurück an die Komponente
    },

    // WANN DARF ÜBERHAUPT GELADEN WERDEN?
    enabled: Boolean(accessToken), // Nur laden wenn man eingeloggt ist
    // Wenn accessToken noch null ist (User lädt gerade), dann gar nicht erst versuchen -> verhindert 401 Fehler
  });
}
