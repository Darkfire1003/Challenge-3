// -- useLogin.ts --
// React Hook für den Login-Prozess über Supabase Auth.
// Zweck:
// - Sendet die E-Mail/Passwort-Daten an Supabase und erhält ein Auth-Objekt.
// - Wird als Mutation (react-query) verwendet, daher ist das Ergebnis asynchron
//   und lässt sich mit onSuccess/onError behandeln.
// Eingaben (LoginInfo): { email: string; password: string }
// Rückgabe (AuthResponse): enthält access_token, refresh_token, user und weitere Metadaten.
// Hinweis: Diese Hook kommuniziert mit dem Supabase Auth-Endpoint und läuft clientseitig.
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../app/api/config";
import { LoginInfo, AuthResponse } from "@/types/auth";

export function useLogin() {
  return useMutation({
    mutationFn: async (info: LoginInfo) => {
      // Sendet die Login-Daten an den Supabase Auth-Endpunkt.
      // Erwartet ein AuthResponse-Objekt mit access_token, refresh_token, expires_in und user.
      const { data } = await authApi.post<AuthResponse>(
        "/token?grant_type=password",
        info,
      );
      return data;
    },
  });
}
