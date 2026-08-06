import { Organization } from "@/app/api/config"; // Base Typ aus Supabase: {id, name, created_at, updated_at, ...}

export type NewOrganization = Omit<
  Organization,
  "id" | "created_at" | "updated_at"
>;
// Omit = "Lass weg"
// NewOrganization = Organization OHNE id, created_at, updated_at
// Beim Erstellen darfst du die nicht mitschicken
// id erstellt Postgres selbst (gen_random_uuid), created_at/updated_at auch automatisch
// Erlaubt nur noch: {name, address, ...} - also nur die Felder die ein User wirklich eingibt

export type UpdateOrganization = Partial<NewOrganization> & { id: string };
// Partial = Alle Felder werden optional
// & { id: string } = ABER id ist Pflicht
// Heißt: Beim Updaten muss ich sagen WELCHE Org (id) und ich darf sagen WAS (name? address?)
// z.B. erlaubt:
// {id: "org-123", name: "Neuer Name"} // nur Name ändern
// {id: "org-123", name: "Neu", address: "Wien"} // Name + Adresse ändern
// Nicht erlaubt: {name: "Neu"} ohne id, weil wir nicht wissen welche Org
