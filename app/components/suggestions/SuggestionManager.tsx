"use client";

import { useState } from "react";
import { useSuggestBeverage } from "@/hooks/useSuggestBeverage";
import { ComicButton } from "../ui/buttons/ComicButton";

export default function SuggestionManager() {
  const suggestBeverage = useSuggestBeverage();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSuggest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    suggestBeverage.mutate(
      { name, description },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
        },
      },
    );
  };

  return (
    <section className="max-w-sm mx-auto comic-card bg-bgCard shadow p-4">
      <h2 className="text-center text-secon font-semibold mb-2">
        Neues Getränk vorschlagen
      </h2>

      {suggestBeverage.isSuccess && (
        <p className="text-xs text-green-600 text-center mb-2">
          Vorschlag wurde eingereicht!
        </p>
      )}
      {suggestBeverage.isError && (
        <p className="text-xs text-red-600 text-center mb-2">
          Fehler: {suggestBeverage.error.message}
        </p>
      )}

      <form onSubmit={handleSuggest} className="flex flex-col gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name des Getränks"
          className="text-sm px-2 py-1  comic-card outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beschreibung"
          className="text-sm px-2 py-1  comic-card  outline-none"
        />
        <ComicButton
          type="submit"
          disabled={suggestBeverage.isPending}
          className="bg-btn comic-text-outline text-white text-xl rounded-full px-4 py-1.5 hover:bg-icon transition disabled:opacity-40"
        >
          Vorschlagen
        </ComicButton>
      </form>
    </section>
  );
}
