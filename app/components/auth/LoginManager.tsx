import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import HamsterLoader from ".././ui/HamsterLoader";

type LoginManagerProps = {
  onBack: () => void;
  onSwitchToRegister: () => void;
};

export default function LoginManager({
  onBack,
  onSwitchToRegister,
}: LoginManagerProps) {
  const loginUser = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    loginUser.mutate({ email, password });
  };

  if (loginUser.isPending) {
    return (
      <section className="relative">
        <div className="bg-bgCard rounded-md p-4 shadow w-56 flex justify-center">
          <HamsterLoader text="Login läuft..." />
        </div>

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

  if (loginUser.isError) {
    return (
      <p className="text-[8px] text-red-600">
        Fehler: {loginUser.error.message}
      </p>
    );
  }

  return (
    <section className="relative">
      <form
        onSubmit={handleLogin}
        className="relative flex flex-col gap-1 bg-bgCard rounded-md p-2 shadow w-43 h-30"
      >
        <label htmlFor="email" className="text-xs">
          E-mail
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
          disabled={loginUser.isPending}
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
        className="absolute top-10 -right-30 px-3 py-1 rounded-full bg-btn hover:bg-icon"
      >
        Zurück
      </button>
    </section>
  );
}
