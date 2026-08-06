// -- useSuggestBeverage.ts --
// React Hook für das Einreichen eines Getränkevorschlags über einen Supabase RPC-Endpunkt.
// Zweck:
// - Sendet Name und optionale Beschreibung eines vorgeschlagenen Getränks an einen
//   serverseitigen RPC-Endpunkt (/rpc/add_beverage_suggestion).
// - Nutzt react-query useMutation für Fehler-Handling und Statusinformationen.
// Eingaben: { name: string; description: string }
// Laufzeit / Sicherheit:
// - Diese Mutation sollte mit einem gültigen accessToken ausgeführt werden. useAuth liefert
//   das accessToken; die Implementierung muss zur Laufzeit den Authorization-Header setzen.
// - Der aktuelle Code verwendet an einigen Stellen einen Platzhalter für den Header;
//   das tatsächliche Token muss vor dem Request eingefügt werden (z. B. in einem Axios-Interceptor
//   oder direkt in der Hook-Implementierung).
// Hinweis: Diese Hook ändert nur das UI/den Datenbestand über die API; sie führt selbst keine UI-Render-Logik aus.
import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/api/config";
import { useAuth } from "@/app/context/AuthContext";

export function useSuggestBeverage() {
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => {
      // Sendet einen Getränkevorschlag an den Supabase RPC-Endpunkt.
      // Nach Abschluss kann die Vorschlagsdatenbank den Vorschlag weiterverarbeiten.
      await api.post(
        "/rpc/add_beverage_suggestion",
        { name, description },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    },
  });
}
