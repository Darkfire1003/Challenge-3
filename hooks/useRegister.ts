// -- useRegister.ts --
// React Hook für die Registrierung über Supabase Auth.
// Zweck:
// - Sendet E-Mail, Passwort und optionale Metadaten an den Supabase /signup Endpunkt.
// - Die user_metadata (z.B. name, organization_id) werden in Supabase gespeichert
//   und können später zur Profilerstellung oder Rollenvergabe verwendet werden.
// Eingaben (RegisterInfo): { email: string; password: string; name?: string; organization_id?: string }
// Rückgabe: Response vom Supabase-Auth-Endpunkt (variabel, abhängig vom Server).
// Hinweis: Diese Hook wird clientseitig aufgerufen und nutzt react-query für Mutation-Handling.
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/app/api/config";
import { RegisterInfo } from "@/types/auth";

export function useRegister() {
  return useMutation({
    mutationFn: async (info: RegisterInfo) => {
      // Registriert einen Benutzer bei Supabase Auth.
      // Die mitgesendeten user_metadata-Felder werden später zur Profilerstellung verwendet.
      const { data } = await authApi.post("/signup", {
        email: info.email,
        password: info.password,
        data: {
          name: info.name,
          organization_id: info.organization_id,
        },
      });
      return data;
    },
  });
}
