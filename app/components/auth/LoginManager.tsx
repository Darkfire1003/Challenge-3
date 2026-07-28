"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useLogin } from "@/hooks/useLogin";
import { useGetProfile } from "@/hooks/useGetProfile";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

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
              onSuccess: (profile) => {
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

  const loginErrorMessage = (() => {
    if (!loginUser.isError) return null;
    const err = loginUser.error as AxiosError;
    return err.response?.status === 400
      ? "Falscher Benutzername oder Passwort."
      : `Fehler: ${err.message}`;
  })();

  if (getProfile.isError)
    return (
      <p className="text-[8px] text-red-600">
        Fehler: {getProfile.error.message}
      </p>
    );

  return (
    <section className="relative">
      <form
        onSubmit={handleLogin}
        className="absolute  bottom-38 -left-18 lg:-left-21.5 lg:bottom-44 flex flex-col gap-1 bg-bgCard rounded-md p-2 shadow w-43 h-32"
      >
        {loginErrorMessage && (
          <p className="text-[8px] text-red-600">{loginErrorMessage}</p>
        )}

        <label htmlFor="email" className="text-xs">
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-Mail"
          className="text-[8px] leading-tight px-1 py-0.5 border border-gray-300 rounded outline-none"
        />
        <label htmlFor="password" className="text-xs">
          Passwort
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          className="text-[8px] leading-tight px-1 py-0.5 border border-gray-300 rounded outline-none"
        />
        <button
          type="submit"
          disabled={loginUser.isPending || getProfile.isPending}
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
