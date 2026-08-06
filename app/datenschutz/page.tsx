/* -- app/datenschutz/page.tsx --
   Datenschutzseite (Privacy Notice) der Anwendung.
   Zweck:
   - Informiert Nutzer über die erhobenen Daten, deren Zweck und die Verantwortlichen.
   - Statische Informationsseite, keine dynamischen API-Aufrufe.
   Hinweise:
   - Diese Seite läuft clientseitig ("use client") weil sie router.back() nutzt.
   - Keine sensiblen Informationen oder Secrets in dieser Datei einfügen.
*/
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
          Datenschutz
        </h1>

        <div className="mt-6 space-y-4 text-secon">
          <section>
            <h2 className="font-semibold">Verantwortliche</h2>
            <p>
              Kuscher Michael &amp; Peter Gabriel, Universitätstraße 25, 9020
              Klagenfurt
            </p>
          </section>

          <section>
            <h2 className="font-semibold">Verarbeitete Daten</h2>
            <p>
              Im Rahmen der Registrierung werden E-Mail-Adresse, Name,
              Organisationszugehörigkeit sowie Nutzungsdaten (Käufe,
              Guthabenstand, Getränkevorschläge) gespeichert. Die Speicherung
              erfolgt über Supabase (Hosting: [Region einfügen]).
            </p>
          </section>

          <section>
            <h2 className="font-semibold">Zweck</h2>
            <p>
              Die Daten werden ausschließlich zur Bereitstellung der Funktionen
              dieser Lernanwendung im Rahmen der Coding School Challenge
              verwendet.
            </p>
          </section>

          <section>
            <h2 className="font-semibold">Kontakt</h2>
            <p>
              Bei Fragen zum Datenschutz: M.kuscher@outlook.com &amp;
              p.gabriel@posteo.de
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
