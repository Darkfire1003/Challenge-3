"use client";
// -- RegisterManager.tsx --
// Registrierungskomponente für neue Nutzer.
// Zweck:
// - Stellt das Registrierungsformular bereit (Name, Email, Passwort, Organisation).
// - Lädt verfügbare Organisationen via useGetOrganizations und sendet die Daten
//   über useRegister an den Supabase /signup-Endpunkt.
// Eingaben (Props): onBack, onSwitchToLogin, onRegisterSuccess (Callbacks)
// Rückgabe: Form-Element (UI). Bei Erfolg wird onRegisterSuccess aufgerufen.
// Laufzeit / Kontext:
// - Clientseitig ("use client"); nutzt react-query-Hooks für Daten und Mutationen.
// - Die Hook useRegister spricht das Supabase Auth-Endpunkt an; Fehler werden
//   im UI angezeigt (z. B. 422 für bereits registrierte E-Mails).
// Hinweise zur Sicherheit:
// - Passwörter werden clientseitig an den Auth-Service gesendet; es ist sicherzustellen,
//   dass die Verbindung HTTPS verwendet (Supabase Host). Es dürfen keine Service-Keys
//   in den Client-Code gelangen.

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useRegister } from "@/hooks/useRegister";
import { useGetOrganizations } from "@/hooks/useGetOrganizations";
import HamsterLoader from "../ui/HamsterLoader";

export default function RegisterManager({
  onBack,
  onSwitchToLogin,
  onRegisterSuccess,
}: {
  onBack: () => void;
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}) {
  const {
    data: organizations,
    isLoading,
    isError,
    error,
  } = useGetOrganizations();
  const registerUser = useRegister();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [organizationId, setOrganizationId] = useState("");

  useEffect(() => {
    if (registerUser.isSuccess) {
      onRegisterSuccess();
    }
  }, [registerUser.isSuccess, onRegisterSuccess]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !name.trim() || !organizationId)
      return;

    registerUser.mutate({
      email,
      password,
      name,
      organization_id: organizationId,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-bgCard absolute lg:-left-21.5 lg:bottom-44 rounded-md p-2 shadow w-43 flex items-center justify-center min-h-28">
        <HamsterLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-xs text-red-600 bg-bgCard rounded-md p-2 shadow w-43">
        Fehler: {error.message}
      </p>
    );
  }

  const registerErrorMessage = (() => {
    if (!registerUser.isError) return null;
    const err = registerUser.error as AxiosError;
    if (err.response?.status === 422)
      return "Diese E-Mail ist bereits registriert oder das Passwort ist zu schwach.";
    if (err.response?.status === 429)
      return "Zu viele Anfragen. Bitte warte kurz und versuche es erneut.";
    return `Fehler: ${err.message}`;
  })();

  return (
    <section className="relative">
      <form
        onSubmit={handleRegister}
        className="absolute bottom-38 -left-18 lg:-left-21.5 lg:bottom-44 flex flex-col gap-1 bg-bgCard rounded-md p-2 shadow w-43"
      >
        {registerErrorMessage && (
          <p className="text-xs text-red-600">{registerErrorMessage}</p>
        )}

        <label htmlFor="name" className="text-xs">
          Vollständiger Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="text-xs leading-tight px-1 py-0.5 border border-gray-300 rounded outline-none"
        />

        <label htmlFor="email" className="text-xs">
          E-Mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-Mail"
          className="text-xs leading-tight px-1 py-0.5 border border-gray-300 rounded outline-none"
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
          className="text-xs leading-tight px-1 py-0.5 border border-gray-300 rounded outline-none"
        />

        <label htmlFor="organization" className="text-xs">
          Organisation
        </label>
        <select
          id="organization"
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
          className="leading-tight text-xs px-1 py-0.5 border border-gray-300 rounded outline-none"
        >
          <option value="">Bitte wählen</option>
          {organizations?.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={registerUser.isPending}
          className="text-xs bg-btn text-white rounded px-1 py-0.5 hover:bg-icon cursor-pointer disabled:opacity-50"
        >
          Registrieren
        </button>

        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[8px] underline"
        >
          Schon registriert? Einloggen
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
