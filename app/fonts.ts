// -- app/fonts.ts --
// Lokale Font-Konfiguration für Next.js (next/font/local).
// Zweck:
// - Lädt lokale Schriftdateien (Fraunces, Inter) und stellt sie als CSS-Variablen
//   (--font-fraunces, --font-inter) bereit, die in globals.css und Komponenten
//   verwendet werden können.
// Hinweise:
// - next/font optimiert das Laden (z. B. Preload/Subset) und ist für die Client- und
//   Server-Integration geeignet. Diese Datei enthält keine Laufzeitlogik, nur Deklarationen.
// - Bei Austausch/Ergänzung von Fonts darauf achten, dass die Pfade unter /public/fonts liegen.

import localFont from "next/font/local";

export const fraunces = localFont({
  src: [
    {
      path: "../public/fonts/Fraunces-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Fraunces-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

export const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});
