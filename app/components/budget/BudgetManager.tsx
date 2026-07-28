"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useUpdateCredits } from "@/hooks/useUpdateCredits";
import { GoldenButton } from "../ui/buttons/GoldenButton";
import HamsterLoader from "../ui/HamsterLoader";

export default function BudgetManager() {
  const { data: profile, isLoading, isError, error } = useProfile();
  const updateCredits = useUpdateCredits();

  const [amount, setAmount] = useState("");

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0 || !profile) return;

    const newCredits = (profile.credits ?? 0) + value;

    updateCredits.mutate(newCredits, {
      onSuccess: () => setAmount(""),
    });
  };

  if (isLoading) return <HamsterLoader />;
  if (isError)
    return <p className="text-center text-red-600">Fehler: {error.message}</p>;

  return (
    <section className="comic-card mx-auto max-w-xl h-1/3 bg-bgCard text-center place-content-center">
      <p className="text-secon text-3xl font-bold">Aktuelles Guthaben</p>
      <p className="text-2xl font-bold text-secon">
        {profile?.credits?.toFixed(2)} €
      </p>

      <form onSubmit={handleTopUp} className="flex flex-col gap-2 mt-4">
        <input
          type="number"
          step="0.50"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Betrag in €"
          className="comic-card h-6 mb-3 text-center text-xl font-bold"
        />
        <GoldenButton
          type="submit"
          disabled={updateCredits.isPending}
          text="Aufladen"
          size="lg"
          className="text-xl font-bold"
        />
      </form>
    </section>
  );
}
