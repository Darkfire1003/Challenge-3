// -- app/page.tsx --
// Startseite / Root-Page des Next.js App Routers.
// Zweck:
// - Rendert die LandingPage, die den Login- und Registrierungs-Flow startet.
// - Fungiert als Einstiegspunkt für nicht authentifizierte Nutzer.
// Laufzeit / Kontext:
// - Rendert clientseitige Komponenten (z. B. LightLines, WaterButton) über die LandingPage.
// - Keine direkten API-Aufrufe in dieser Datei; die LandingPage kapselt alle Interaktionen.

import LandingPage from "./components/landing/LandingPage";

export default function Home() {
  return (
    <>
      {/* Client-seitige LandingPage mit Login- und Registrierungs-Komponenten */}
      <LandingPage />
    </>
  );
}
