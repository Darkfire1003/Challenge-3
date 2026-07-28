"use client";

import { useState } from "react";
import LoginManager from "../auth/LoginManager";
import RegisterManager from "../auth/RegisterManager";
import Image from "next/image";
import { LightLines } from "../ui/light-lines";
import { PopButton } from "../ui/buttons/pop-button";

export default function LandingPage() {
  const [view, setView] = useState<"closed" | "login" | "register">("closed");
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleRegisterSuccess = () => {
    setView("closed");
    setShowEmailModal(true);
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden  flex flex-col items-center justify-center px-4">
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
            Hier werden Getränkewünsche <strong className="drop-shadow-xs drop-shadow-prime">Wahr</strong>!!
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
          <PopButton
            onClick={() => setView("login")}
            className="lg:absolute lg:top-1/2 lg:left-full lg:ml-8  px-6 py-2 rounded-full transition whitespace-nowrap"
          >
            Hier einloggen
          </PopButton>
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
