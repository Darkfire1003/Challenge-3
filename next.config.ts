// -- next.config.ts --
// Next.js-Konfigurationsdatei für lokale Entwicklung
// und Deployment auf GitHub Pages.

import type { NextConfig } from "next";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  // Erstellt beim Build einen statischen Export im Ordner "out".
  output: "export",

  // GitHub-Pages-Projekte werden unter /repository-name ausgeliefert.
  // Lokal bleibt die Anwendung unter "/" erreichbar.
  basePath: isGitHubActions ? "/challenge-3" : "",

  // Wichtig für GitHub Pages und statische Exporte.
  trailingSlash: true,

  images: {
    // GitHub Pages unterstützt keine serverseitige Next.js-Bildoptimierung.
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "rfegraoskgndulpspcqd.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
