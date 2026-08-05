"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { cn } from "./../../lib/utils";
import Image from "next/image";
import BeverageManager from "../beverages/BeverageManager";
import BudgetManager from "../budget/BudgetManager";
import SuggestionManager from "../suggestions/SuggestionManager";
import HamsterLoader from "../ui/HamsterLoader";
import { useProfile } from "../../../hooks/useProfile";
import { ComicButton } from "../ui/buttons/ComicButton";
import ProfileEditModal from "./ProfileEditModal";
import WaterButton from "../ui/buttons/WaterButton";

const views = {
  buy: "Kaufen",
  budget: "Guthaben",
  suggest: "Idee einbringen",
} as const;

type View = keyof typeof views;

export default function UserDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const [activeView, setActiveView] = useState<View>("buy");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: profile, isLoading, isError, error } = useProfile();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSelectView = (key: View) => {
    setActiveView(key);
    setIsSidebarOpen(false);
  };

  if (isLoading) return <HamsterLoader />;
  if (isError)
    return <p className="text-center text-red-600">Fehler: {error.message}</p>;

  const credits = profile?.credits ?? 0;
  const creditsBg =
    credits <= 0
      ? "bg-red-500"
      : credits <= 5
        ? "bg-orange-400"
        : "bg-green-400";

  const creditsMessage =
    credits <= 0
      ? "Guthaben aufladen erforderlich!"
      : credits <= 5
        ? "Guthaben wird knapp!"
        : null;

  return (
    <main className="min-h-screen w-full bg-linear-to-b from-secon via-prime to-secon flex relative">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 bg-bgCard rounded-lg p-2 shadow"
      >
        <span className="block w-6 h-0.5 bg-secon mb-1" />
        <span className="block w-6 h-0.5 bg-secon mb-1" />
        <span className="block w-6 h-0.5 bg-secon" />
      </button>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
        />
      )}

      <aside
        className={`comic-look-soft fixed inset-y-0 left-0 z-40 flex w-56 flex-col gap-2 bg-icon p-4 rounded-r-[0.4em] transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center gap- mb-6  lg:mt-0">
          <Image
            src="/logo.png"
            alt="Stay Hydrated Firmen Logo"
            width={500}
            height={500}
            className="w-24 lg:w-42 h-auto"
          />
        </div>
        <div className="mb-3 text-center">
          <button
            onClick={() => setIsEditingProfile(true)}
            className="mx-auto flex flex-col items-center gap-1"
          >
            {profile?.avatar_path && (
              <Image
                src={`/${profile.avatar_path}`}
                alt="Avatar"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full"
              />
            )}
            <span className="font-bold text-secon underline">
              {profile?.name}
            </span>
          </button>
          <p className="text-xs text-secon/70">
            {profile?.organizations?.name}
          </p>
        </div>
        <div className="relative mb-3">
          <div
            className={cn(
              "comic-look p-3 text-center transition-colors",
              creditsBg,
            )}
          >
            <p className="text-secon font-bold">Aktuelles Guthaben</p>
            <p className="text-2xl font-semibold text-secon">
              {profile?.credits?.toFixed(2)} €
            </p>
          </div>

          {creditsMessage && (
            <div className="relative mt-3">
              <div
                className={`absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rotate-45 border-t-[3px] border-l-[3px] border-black ${
                  credits <= 0 ? "bg-red-500" : "bg-orange-400"
                }`}
              />
              <div
                className={`relative rounded-[0.4em] border-[3px] border-black px-3 py-2 text-xs font-medium text-white text-center shadow-[0.1em_0.1em_0_#000] ${
                  credits <= 0 ? "bg-red-500" : "bg-orange-400"
                }`}
              >
                {creditsMessage}
              </div>
            </div>
          )}
        </div>

        {(Object.keys(views) as View[]).map((key) => (
          <ComicButton
            key={key}
            onClick={() => handleSelectView(key)}
            className={cn(
              "rounded-lg px-3 py-3 text-left text-xl transition",
              activeView === key
                ? "bg-btn text-white"
                : "text-secon hover:bg-white/50",
            )}
          >
            <span className={cn(activeView === key && "comic-text-outline")}>
              {views[key]}
            </span>
          </ComicButton>
        ))}

        <WaterButton
          className="comic-text-outline text-2xl font-bold mt-3 lg:mt-35"
          label="Ausloggen"
          textColor="#ffffff"
          waterColor="#FF0000"
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
          onClick={() => handleLogout()}
        />
      </aside>

      <section className="flex-1 px-4 py-8 pt-20 lg:pt-8">
        {activeView === "buy" && <BeverageManager />}
        {activeView === "budget" && <BudgetManager />}
        {activeView === "suggest" && <SuggestionManager />}
      </section>
      {isEditingProfile && (
        <ProfileEditModal
          currentName={profile?.name ?? ""}
          currentAvatar={profile?.avatar_path ?? null}
          onClose={() => setIsEditingProfile(false)}
        />
      )}
    </main>
  );
}
