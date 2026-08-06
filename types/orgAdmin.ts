// Typ = Bauplan wie ein Getränke-Vorschlag in der DB aussieht

export type BeverageSuggestion = {
  id: string; // Eindeutige ID z.B. "sug-123" - Primary Key in der Tabelle

  organization_id: string | null; // Zu welcher Org gehört der Vorschlag?
  // z.B. "org-99" = Vorschlag nur für diese Org
  // null = Vorschlag für alle / keine Org zugeordnet (für globalen Admin)

  name: string; // Name des vorgeschlagenen Getränks z.B. "Mate Zero"

  description: string | null; // Optionaler Text z.B. "Bio, 0.5L, extra Koffein"
  // null = User hat keine Beschreibung geschrieben

  status: "pending" | "approved" | "rejected" | null; // Zustand des Vorschlags
  // pending = wartet auf Freigabe, approved = wurde übernommen, rejected = abgelehnt
  // null = noch kein Status gesetzt (Fallback, sollte eigentlich immer pending sein)
  // Nur diese 3 Strings sind erlaubt, alles andere gibt TypeScript Fehler

  suggested_by: string | null; // Wer hat vorgeschlagen? User ID z.B. "user-456"
  // null = unbekannt / System Vorschlag

  created_at: string; // Wann erstellt? ISO Datum z.B. "2026-08-06T14:30:00.000Z"
  // Kommt so aus Postgres als String
};
