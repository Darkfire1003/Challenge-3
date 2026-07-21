"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";

export default function LoginManager({ onBack }: { onBack: () => void }) {
  const loginUser = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    loginUser.mutate({ username, password });
  };

  if (loginUser.isError)
    return (
      <p className="text-[8px] text-red-600">
        Fehler: {loginUser.error.message}
      </p>
    );

  return (
    <section>
      <form
        onSubmit={handleLogin}
        className="relative flex flex-col gap-1 bg-bgCard rounded-md p-2 shadow w-43 h-28"
      >
        <label htmlFor="username" className="text-xs">
          Benutzername
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Benutzer"
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
          disabled={loginUser.isPending}
          className="text-[8px] bg-btn text-white rounded px-1 py-0.5 hover:bg-icon cursor-pointer disabled:opacity-50"
        >
          Hier einloggen
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
