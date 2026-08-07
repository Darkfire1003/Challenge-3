import type { Metadata } from "next";
// Globale Styles und Root-Layout der App.
// Diese Datei ist das Root-Layout für Next.js App Router und definiert:
// - globale Metadaten (title, description)
// - das Laden globaler CSS-Dateien (globals.css)
// - die Wrapper-Provider (Providers) und persistente UI-Elemente (Footer)
import "./globals.css";
import Providers from "./providers";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Stay Hydrated",
  description: "Getränkeverwaltung",
};

// RootLayout ist das oberste Layout des Next.js App Routers.
// Zweck und Verantwortung:
// - Setzt das HTML lang-Attribut (hier: 'de') für i18n/SEO.
// - Verpackt die App mit Providers (z. B. React Query, Auth Context), damit
//   Kinderkomponenten Zugriff auf Cache und Auth-Status haben.
// - Rendert Footer persistent auf allen Seiten, sodass Impressum/Datenschutz-Links
//   stets verfügbar sind.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className="flex min-h-screen flex-col">
        <Providers>
          {/* Haupt-Inhaltsbereich: children sind die von Next.js gerenderten Seiten/Layouts */}
          <div className="flex flex-1 h-full flex-col">{children}</div>
          {/* Persistenter Footer, der auf allen Seiten angezeigt wird */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
