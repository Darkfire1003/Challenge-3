"use client";

import { useState } from "react";
import LoginManager from "../auth/LoginManager";
import RegisterManager from "../auth/RegisterManager";
import Image from "next/image";

export default function LandingPage() {
  const [view, setView] = useState<"closed" | "login" | "register">("closed");
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleRegisterSuccess = () => {
    setView("closed");
    setShowEmailModal(true);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-prime flex flex-col items-center justify-center">
      <div className="relative">
        <div
          className={`text-left absolute right-full top-20 mr-10 w-48 transition-opacity duration-300 ${
            view !== "closed" ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <Image
            src="/logo.png"
            alt="Stay Hydrated Firmen Logo"
            height={350}
            width={350}
          />
          <p className="text-center text-xl text-secon">
            Hier Werden Getränkewünsche <strong>Wahr</strong>!!
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
            className={`absolute left-46 bottom-54 -translate-x-1/2 flex items-center justify-center transition-opacity duration-500 ${
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
          <button
            onClick={() => setView("login")}
            className="absolute top-1/2 left-full ml-8 -translate-y-1/2 px-6 py-2 rounded-full bg-white/80 hover:bg-white transition whitespace-nowrap"
          >
            Hier einloggen
          </button>
        )}
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900">
              E-Mail bestätigen
            </h2>

            <p className="mt-2 text-sm text-gray-700">
              Bitte bestätigen Sie die Ihnen zugesendete E-Mail.
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
