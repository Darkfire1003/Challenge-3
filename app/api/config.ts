// -- app/api/config.ts --
// Axios-Clients und zentrale Typen für Supabase-Zugriffe.
// Zweck:
// - Stellt zwei vor-konfigurierte Axios-Clients bereit:
//   1) `api` für REST-API-Aufrufe gegen die Supabase-REST-API (rest/v1)
//   2) `authApi` für Auth-Operationen gegen den Supabase Auth-Endpunkt (auth/v1)
// - Definiert außerdem TypeScript-Typen für Beverage, Organization, Profile, etc.,
//   die von Hooks und Komponenten im Projekt verwendet werden.
// Wichtige Hinweise zur Sicherheit und Laufzeit:
// - Die hier gesetzten Header enthalten einen Platzhalter für den Authorization-Header
//   (``Authorization: `******``). In der Laufzeit muss ein gültiges accessToken gesetzt
//   werden. Möglichkeiten hierfür sind:
//     • Hooks setzen den Header vor jedem Request (z. B. in useQuery/useMutation).
//     • Ein Axios-Interceptor fügt den aktuellen Token automatisch hinzu.
// - API-Keys werden aus der Umgebungsvariable NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY gelesen.
//   Secrets (z. B. service_role keys) dürfen niemals in den Client-Code gelangen.
// Regeln:
// - Diese Datei wurde nur dokumentiert — es wurden keine Änderungen an der Logik vorgenommen.

import axios from "axios";

export const api = axios.create({
  baseURL: "https://rfegraoskgndulpspcqd.supabase.co/rest/v1",
  timeout: 10000,
  headers: {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
  },
});

export const authApi = axios.create({
  baseURL: "https://rfegraoskgndulpspcqd.supabase.co/auth/v1",
  timeout: 10000,
  headers: {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
});

export type Beverage = {
  id: string;
  organization_id: string;
  name: string;
  price: number;
  description: string | null;
  stock: number | null;
  is_available: boolean | null;
  created_at: string;
  updated_at: string;
  image_path: string | null;
};
export type Organization = {
  id: string;
  name: string;
  address: string | null;
  created_at: string;
  updated_at: string;
};
export type Profile = {
  id: string;
  organization_id: string | null;
  role: "admin" | "org_admin" | "user" | null;
  credits: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
  name: string | null;
  avatar_path: string | null;
};
export type ProfileWithOrganization = Profile & {
  organizations: { name: string } | null;
};

export type NewBeverage = Omit<Beverage, "id" | "created_at" | "updated_at">;
export type UpdateBeverage = Partial<NewBeverage> & { id: string };
