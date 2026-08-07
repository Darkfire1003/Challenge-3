"use client";
// -- LandingPage.tsx --
// Haupt-Landingpage der App. Steuert den Wechsel zwischen geschlossener Ansicht,
// Login-Formular und Registrierungsformular. Diese Seite stellt den Einstieg in
// den Auth-Flow dar und zeigt visuelle Elemente wie das Automatenbild.
//
// Zweck und Rolle:
// - Dient als visuell ansprechender Einstiegspunkt für nicht-angemeldete Nutzer.
// - Steuert lokale UI-Zustände (view: closed | login | register) und zeigt
//   basierend darauf die entsprechenden Overlays (Login/Register) an.
// - Verwendet visuelle Komponenten wie LightLines und WaterButton, die rein clientseitig laufen.


import { useState } from "react";
import LoginManager from "../auth/LoginManager";
import RegisterManager from "../auth/RegisterManager";
import Image from "next/image";
import { LightLines } from "../ui/light-lines";
import WaterButton from "../ui/buttons/WaterButton";

export default function LandingPage() {
  const [view, setView] = useState<"closed" | "login" | "register">("closed");
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleRegisterSuccess = () => {
    // Nach erfolgreicher Registrierung wird das Anmelde-Overlay geschlossen
    // und ein Hinweis angezeigt, dass die Bestätigung per E-Mail erfolgen muss.
    setView("closed");
    setShowEmailModal(true);
  };

  return (
    <main className="relative flex-1 w-full overflow-x-hidden flex flex-col items-center justify-center px-4">
      <LightLines
        className="pointer-events-none"
        linesOpacity={0.05}
        lightsOpacity={0.8}
        speedMultiplier={0.5}
        gradientFrom="#6a95ae"
        gradientTo="#1e3a8a"
        lightColor="#ffffff"
        lineColor="#ffffff"
      />
      <div className="relative flex flex-col items-center lg:block">
        <div
          className={`text-center lg:absolute lg:right-full lg:top-20 lg:mr-10  flex flex-col items-center  transition-opacity duration-300 ${
            view !== "closed" ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <Image
            src="/logo.png"
            alt="Stay Hydrated Firmen Logo"
            height={450}
            width={450}
            className="w-24 h-auto lg:w-88"
          />
          <p className="text-xs lg:text-2xl font-bold drop-shadow-xs drop-shadow-secon text-center text-white mt-2">
            Hier werden Getränkewünsche{" "}
            <strong className="drop-shadow-xs drop-shadow-prime">Wahr</strong>!!
          </p>
        </div>

        <div
          className={`relative transition-transform duration-500 ease-in-out ${
            view !== "closed"
              ? "scale-[2.3] translate-y-0"
              : "scale-100 translate-y-0"
          }`}
        >
          <Image
            src="/automat.png"
            alt="Getränkeautomat"
            width={500}
            height={800}
          />

          <div
            className={`absolute left-46 bottom-10 -translate-x-1/2 flex items-center justify-center transition-opacity duration-500 ${
              view !== "closed"
                ? "opacity-100 delay-300"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {view === "login" && (
              <LoginManager
                onBack={() => setView("closed")}
                onSwitchToRegister={() => setView("register")}
              />
            )}

            {view === "register" && (
              <RegisterManager
                onBack={() => setView("closed")}
                onSwitchToLogin={() => setView("login")}
                onRegisterSuccess={handleRegisterSuccess}
              />
            )}
          </div>
        </div>

        {view === "closed" && (
          <div className="absolute top-1/2 left-full ml-8 -translate-y-1/2">
            <WaterButton
              className="comic-text-outline text-2xl font-bold"
              label="Hier Einloggen"
              textColor="#ffffff"
              waterColor="#22d3ee"
              waterAmount={62}
              rounded={999}
              paddingX={52}
              paddingY={28}
              glass={{
                blur: 24,
                tint: "rgba(255,255,255,0.10)",
                frost: 12,
              }}
              borderOptions={{
                color: "rgba(255,255,255,0.35)",
                stroke: 1,
              }}
              shadowOptions={{
                color: "#000000",
                intensity: 35,
              }}
              onClick={() => setView("login")}
            />
          </div>
        )}
      </div>
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900">
              E-Mail bestätigen
            </h2>

            <p className="mt-2 text-sm text-gray-700">
              Bitte bestätigen Sie die Ihnen zugesendete E-Mail, um die
              Registrierung abzuschließen (kann einige Minuten dauern).
            </p>

            <button
              type="button"
              onClick={() => setShowEmailModal(false)}
              className="mt-4 rounded-md bg-btn px-4 py-2 text-white hover:bg-icon"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
