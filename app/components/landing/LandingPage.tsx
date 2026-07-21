"use client";

import { useState } from "react";
import LoginManager from "../auth/LoginManager";
import Image from "next/image";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-prime flex flex-col items-center justify-center">
      <div className="relative">
        <div
          className={`text-left absolute right-full top-20 mr-10 w-48 transition-opacity duration-300 ${
            showLogin ? "opacity-0 pointer-events-none" : "opacity-100"
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
            showLogin ? "scale-[2.3] translate-y-0" : "scale-100 translate-y-0"
          }`}
        >
          <Image
            src="/automat.png"
            alt="Getränkeautomat"
            width={500}
            height={800}
          />

          <div
            className={`absolute left-46 bottom-55 -translate-x-1/2 flex items-center justify-center transition-opacity duration-500 ${
              showLogin
                ? "opacity-100 delay-300"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <LoginManager onBack={() => setShowLogin(false)} />
          </div>
        </div>

        {!showLogin && (
          <button
            onClick={() => setShowLogin(true)}
            className="absolute top-1/2 left-full ml-8 -translate-y-1/2 px-6 py-2 rounded-full bg-white/80 hover:bg-white transition whitespace-nowrap"
          >
            Hier einloggen
          </button>
        )}
      </div>
    </main>
  );
}
