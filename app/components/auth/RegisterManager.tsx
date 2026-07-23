"use client";

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

    if (!email.trim() || !password.trim() || !name.trim() || !organizationId) {
      return;
    }

    registerUser.mutate({
      email,
      password,
      name,
      organization_id: organizationId,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-bgCard rounded-md p-2 shadow w-43 flex items-center justify-center min-h-28">
        <HamsterLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-[8px] text-red-600 bg-bgCard rounded-md p-2 shadow w-43">
        Fehler: {error.message}
      </p>
    );
  }

  if (registerUser.isError) {
    const error = registerUser.error as AxiosError;
    const status = error.response?.status;

    return (
      <p className="text-[8px] text-red-600 bg-bgCard rounded-md p-2 shadow w-43">
        {status === 429
          ? "Zu viele Anfragen. Bitte warte kurz und versuche es erneut."
          : `Fehler: ${error.message}`}
      </p>
    );
  }

  return (
    <section className="relative">
      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-1 bg-bgCard rounded-md p-2 shadow w-43"
      >
        <label htmlFor="name" className="text-xs">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="text-[8px] leading-tight px-1 py-0.5 border border-gray-300 rounded outline-none"
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

        <label htmlFor="organization" className="text-xs">
          Organisation
        </label>
        <select
          id="organization"
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
          className="text-[8px] leading-tight px-1 py-0.5 border border-gray-300 rounded outline-none"
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
          className="text-[8px] bg-btn text-white rounded px-1 py-0.5 hover:bg-icon cursor-pointer disabled:opacity-50"
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
        className="absolute top-10 -right-30 px-3 py-1 rounded-full bg-btn hover:bg-icon"
      >
        Zurück
      </button>
    </section>
  );
}
