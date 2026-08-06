// -- app/UserPage/page.tsx --
// Nutzerseite: Einstiegspunkt für angemeldete Benutzer.
// Zweck:
// - Rendert das UserDashboard, welches die Kernfunktionen für Endnutzer bereitstellt
//   (Getränke kaufen, Guthaben verwalten, Vorschläge einreichen).
// Laufzeit/Kontext:
// - Client-seitige Interaktionen finden im Dashboard statt; diese Seite fungiert als Container.

import UserDashboard from "../components/dashboard/UserDashboard";

export default function Userpage() {
  return (
    <div>
      <UserDashboard />
    </div>
  );
}
