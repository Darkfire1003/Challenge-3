// -- next.config.ts --
// Next.js Konfigurationsdatei (nur konfigurativer Inhalt).
// Zweck:
// - Definiert hier erlaubte Remote-Image-Quellen (remotePatterns) für next/image,
//   damit Bilder von Supabase Storage und Unsplash sicher geladen werden können.
// Hinweise zur Sicherheit:
// - Erlaubte Hostnamen begrenzen, von welchen Domains Bilder geladen werden dürfen.
// - Diese Datei ist Konfiguration und enthält keine Applikations-Logik.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
