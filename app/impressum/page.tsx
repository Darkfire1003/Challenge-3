"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-prime px-4 py-12">
      <div className="comic-card relative mx-auto max-w-2xl bg-white p-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 rounded-full bg-btn px-3 py-1 w-fit hover:bg-icon"
        >
          Zurück
        </button>

        <h1 className="comic-text-outline text-center text-3xl font-bold">
          Impressum
        </h1>

        <div className="mt-6 space-y-4 text-secon">
          <section>
            <h2 className="font-semibold">
              Angaben gemäß §5 ECG / §25 MedienG
            </h2>
            <p>Kuscher Michael</p>
            <p>Peter Gabriel</p>
            <p>Universitätstraße 25, 9020 Klagenfurt</p>
            <p>M.kuscher@outlook.com &amp; p.gabriel@posteo.de</p>
          </section>

          <section>
            <h2 className="font-semibold">Projektkontext</h2>
            <p>
              Diese Anwendung entstand im Rahmen der Coding School Challenge
              „Let`s Stay Hydrated" (JML Coding School GmbH, WS2025) und dient
              ausschließlich Ausbildungszwecken.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
