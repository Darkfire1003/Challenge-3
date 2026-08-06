// -- app/components/Footer.tsx --
// Globaler Footer der Anwendung: wird im Root-Layout eingebunden und auf allen Seiten angezeigt.
// Zweck:
// - Zeigt rechtliche Links (Impressum, Datenschutz) und ein kurzes Copyright-Statement.
// - Rein präsentationsorientierte Komponente, keine API- oder Auth-Logik.
// Laufzeit-Kontext:
// - Kann serverseitig gerendert werden; next/link sorgt für clientseitige Navigation.
// Hinweise:
// - Änderungen an Texten (z. B. Copyright) sollten mit den Projektverantwortlichen abgestimmt werden.

import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" flex w-full flex-col items-center justify-around gap-3 border-t-[3px] border-black bg-icon px-4 py-4 text-sm text-secon md:flex-row">
      <p className="comic-text-outline font-semibold">
        Stay Hydrated © 2026 – Kuscher Michael &amp; Peter Gabriel
      </p>

      <div className="flex items-center gap-4">
        <Link href="/impressum" className="transition-all hover:underline">
          Impressum
        </Link>
        <div className="h-5 w-px bg-secon/30" />
        <Link href="/datenschutz" className="transition-all hover:underline">
          Datenschutz
        </Link>
      </div>
    </footer>
  );
}