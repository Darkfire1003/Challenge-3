"use client";
// -- LoginManager.tsx --
// Diese Komponente zeigt das Login-Formular für bestehende Nutzer.
// Sie nutzt den Supabase Auth-Flow über useLogin, liest das Profil mit useGetProfile
// und legt bei Bedarf ein neues Profil mit useCreateProfile an.
// Nach erfolgreichem Login speichert sie das Token in AuthContext und leitet weiter.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useLogin } from "@/hooks/useLogin";
import { useGetProfile } from "@/hooks/useGetProfile";
import { useCreateProfile } from "@/hooks/useCreateProfile";
import { useAuth } from "@/app/context/AuthContext";

const roleRoutes: Record<string, string> = {
  admin: "/AdminPage",
  org_admin: "/OrganisationAdminPage",
  user: "/UserPage",
};

export default function LoginManager({
  onBack,
  onSwitchToRegister,
}: {
  onBack: () => void;
  onSwitchToRegister: () => void;
}) {
  const router = useRouter();
  const loginUser = useLogin();
  const getProfile = useGetProfile();
  const createProfile = useCreateProfile();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingApproval, setPendingApproval] = useState(false);

  // Verarbeitet das Login-Formular:
  // Ablauf:
  // 1) Validierung der Eingaben (E-Mail und Passwort müssen gesetzt sein)
  // 2) Aufruf von useLogin.mutate um das Auth-Objekt (access_token u.a.) zu erhalten
  // 3) Mit dem erhaltenen access_token wird versucht, das zugehörige Profil zu laden (useGetProfile)
  // 4) Falls kein Profil existiert: createProfile aufrufen und auf Freigabe warten
  // 5) Falls Profil existiert und aktiv ist: Token in AuthContext speichern (login) und Weiterleitung
  // Hinweise:
  // - access_token wird temporär an getProfile/createProfile übergeben, damit die REST-API
  //   den Authorization-Header nutzen kann (im Code als Platzhalter dargestellt).
  // - Fehler-Handling wird über react-query-Statusfelder (isError, error) gesteuert.
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    loginUser.mutate(
      { email, password },
      {
        onSuccess: (authData) => {
          getProfile.mutate(
            { userId: authData.user.id, accessToken: authData.access_token },
            {
              onSuccess: async (profile) => {
                if (!profile) {
                  await createProfile.mutateAsync({
                    userId: authData.user.id,
                    accessToken: authData.access_token,
                    name: authData.user.user_metadata?.name ?? "",
                    organizationId:
                      authData.user.user_metadata?.organization_id ?? "",
                  });
                  setPendingApproval(true);
                  return;
                }

                if (!profile.is_active) {
                  setPendingApproval(true);
                  return;
                }

                login(authData.access_token, authData.user.id);

                const target = roleRoutes[profile.role ?? ""];
                if (target) router.push(target);
              },
            },
          );
        },
      },
    );
  };

  // Hilfsfunktion zur Erzeugung einer benutzerfreundlichen Fehlermeldung
  // basierend auf dem Status der useLogin-Mutation. Unterscheidet spezifisch
  // einen 400-Status (falsche Zugangsdaten) von anderen Fehlern.
  const loginErrorMessage = (() => {
    if (!loginUser.isError) return null;
    const err = loginUser.error as AxiosError;
    return err.response?.status === 400
      ? "Falscher Benutzername oder Passwort."
      : `Fehler: ${err.message}`;
  })();

  if (getProfile.isError) {
    return (
      <p className="text-[8px] text-red-600">
        Fehler: {getProfile.error.message}
      </p>
    );
  }

  if (pendingApproval) {
    return (
      <div className="absolute bottom-38 left-1/2 -translate-x-1/2 lg:bottom-44">
        <div className="bg-bgCard rounded-md p-2 shadow w-43 text-center flex flex-col gap-2">
          <p className="text-[8px]">
            Dein Konto wartet noch auf Freigabe durch einen Organisations-Admin.
          </p>

          <button
            type="button"
            onClick={onBack}
            className="text-[8px] bg-btn text-white rounded px-1 py-0.5 hover:bg-icon cursor-pointer"
          >
            Zurück zum Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="relative">
      <form
        onSubmit={handleLogin}
        className="absolute bottom-38 -left-18 lg:-left-21.5 lg:bottom-44 flex flex-col gap-1 bg-bgCard rounded-md p-2 shadow w-43 h-32"
      >
        {loginErrorMessage && (
          <p className="text-[8px] text-red-600">{loginErrorMessage}</p>
        )}

        <label htmlFor="email" className="text-xs">
          Email
        </label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-Mail"
          className="text-[8px] leading-tight px-1 py-0.5 border border-gray-300 rounded outline-none"
        />

        <label htmlFor="password" className="text-xs">
          Passwort
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          className="text-[8px] leading-tight px-1 py-0.5 border border-gray-300 rounded outline-none"
        />

        <button
          type="submit"
          disabled={
            loginUser.isPending ||
            getProfile.isPending ||
            createProfile.isPending
          }
          className="text-[8px] bg-btn text-white rounded px-1 py-0.5 hover:bg-icon cursor-pointer disabled:opacity-50"
        >
          Hier einloggen
        </button>

        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-[8px] underline"
        >
          Noch kein Konto? Registrieren
        </button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="absolute bottom-25 -right-12 lg:left-30 lg:bottom-50 px-3 py-1 w-fit rounded-full bg-btn hover:bg-icon"
      >
        Zurück
      </button>
    </section>
  );
}
