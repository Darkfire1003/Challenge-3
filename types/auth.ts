// -- types/auth.ts --
// Enthält Typdefinitionen für den Authentifizierungs-Flow.
// Zweck:
// - LoginInfo: Eingabedaten für Login-Formulare (E-Mail + Passwort).
// - AuthResponse: Struktur der Antwort vom Supabase-Auth-Endpunkt
//   (access_token, refresh_token, Ablaufzeit und Benutzerinformationen).
// - RegisterInfo: Erwartete Felder für die Registrierung.
// Diese Typen werden clientseitig von Hooks und Komponenten verwendet,
// um die Eingabe- und Response-Formate statisch zu überprüfen.

export type LoginInfo = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    user_metadata?: {
      name?: string;
      organization_id?: string;
    };
  };
};

export type RegisterInfo = {
  email: string;
  password: string;
  name: string;
  organization_id: string;
};
