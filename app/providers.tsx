"use client";

/**
 * app/providers.tsx
 *
 * Setzt die globalen HOCs/Provider für die Anwendung:
 * - QueryClientProvider (react-query): verwaltet den Cache, Refetching, Mutations und Invalidation
 * - AuthProvider: stellt accessToken/userId/login/logout für alle Kindkomponenten bereit
 * - ReactQueryDevtools: optionale Entwicklertools zur Inspektion des react-query-Caches
 *
 * Hinweise zum Verhalten:
 * - QueryClient wird per useState erzeugt, sodass er über Re-Renders stabil bleibt.
 * - Default Options: Die hier gesetzten Optionen bestimmen das Standardverhalten von Queries
 *   (z. B. staleTime und retry). Anpassungen in einzelnen Hooks sind weiterhin möglich.
 * - Diese Datei läuft clientseitig ("use client"), da AuthProvider auf localStorage zugreift.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  // QueryClient wird einmal pro Providers-Instanz erzeugt.
  // defaultOptions: Queries werden 60s gecached und bei Fehlern einmal erneut versucht.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1 } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* AuthProvider stellt accessToken/userId/login/logout für Kindkomponenten bereit */}
      <AuthProvider>{children}</AuthProvider>
      {/* React Query Devtools — nützlich in der Entwicklung zum Inspizieren von Cache & Queries */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
