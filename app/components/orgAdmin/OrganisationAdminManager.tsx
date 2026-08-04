"use client";

import { useState, useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useGetBeverages } from "@/hooks/useGetBeverages";
import { useCreateBeverage } from "@/hooks/useCreateBeverage";
import { useUpdateBeverage } from "@/hooks/useUpdateBeverage";
import { useDeleteBeverage } from "@/hooks/useDeleteBeverage";
import { useGetBeverageSuggestions } from "@/hooks/useGetBeverageSuggestions";
import { useApproveBeverageSuggestion } from "@/hooks/useApproveBeverageSuggestion";
import { useRejectBeverageSuggestion } from "@/hooks/useRejectBeverageSuggestion";
import { useGetOrganizationUsers } from "@/hooks/useGetOrganizationUsers";
import { useActivateUser } from "@/hooks/useActivateUser";
import { useDeleteUser } from "@/hooks/useDeleteUser";

export default function OrganisationAdminManager() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const orgId = profile?.organization_id || null;

  const {
    data: beverages,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetBeverages();
  const createBeverage = useCreateBeverage();
  const updateBeverage = useUpdateBeverage();
  const deleteBeverage = useDeleteBeverage();

  const { data: suggestions } = useGetBeverageSuggestions(orgId);
  const approveSuggestion = useApproveBeverageSuggestion();
  const rejectSuggestion = useRejectBeverageSuggestion();

  const { data: orgUsers } = useGetOrganizationUsers(orgId);
  const activateUser = useActivateUser();
  const deleteUser = useDeleteUser();

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const lowStock = useMemo(
    () => beverages?.filter((b) => (b.stock ?? 0) < 5) || [],
    [beverages],
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !orgId) return;
    createBeverage.mutate(
      {
        organization_id: orgId,
        name: newName,
        price: parseFloat(newPrice) || 0,
        stock: parseInt(newStock) || 0,
        is_available: true,
        description: null,
        image_path: newImageUrl || null,
      } as any,
      {
        onSuccess: () => {
          setNewName("");
          setNewPrice("");
          setNewStock("");
          setNewImageUrl("");
        },
      },
    );
  };

  if (profileLoading || isLoading) return <p>Lädt…</p>;
  if (isError) return <p>Fehler: {error.message}</p>;

  return (
    <section className="max-w-5xl mx-auto p-4 flex flex-col gap-8">
      {isFetching && <p>Aktualisiere…</p>}

      {lowStock.length > 0 && (
        <div className="comic-card bg-yellow-100 border-2 border-black p-4">
          <h2 className="font-bold">Bestandswarnung: Unter 5 Einheiten</h2>
          <ul className="list-disc ml-5 mt-2">
            {lowStock.map((b) => (
              <li key={b.id}>
                {b.name} – nur noch {b.stock} übrig
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="comic-card bg-white p-4">
        <h2 className="font-bold text-xl mb-3">
          Getränke verwalten (Org: {profile?.organizations?.name})
        </h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-2 mb-4">
          <div className="flex flex-wrap gap-2">
            <input
              className="border-2 border-black rounded p-2"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="border-2 border-black rounded p-2 w-24"
              placeholder="Preis"
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
            <input
              className="border-2 border-black rounded p-2 w-24"
              placeholder="Bestand"
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
            />
          </div>
          <input
            className="border-2 border-black rounded p-2"
            placeholder="Bild URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
          {newImageUrl && (
            <img
              src={newImageUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border-2 border-black"
            />
          )}
          <button
            type="submit"
            disabled={createBeverage.isPending}
            className="comic-look px-4 py-2 w-fit"
          >
            {createBeverage.isPending ? "Speichert..." : "Anlegen"}
          </button>
        </form>

        <ul className="grid md:grid-cols-2 gap-3">
          {beverages?.map((b) => (
            <li
              key={b.id}
              className="border-2 border-black rounded p-2 flex justify-between items-center gap-2"
            >
              <div className="flex gap-2 items-center">
                {b.image_path ? (
                  <img
                    src={b.image_path}
                    alt={b.name}
                    className="w-12 h-12 object-cover rounded border"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs">
                    Kein Bild
                  </div>
                )}
                <div>
                  <p className="font-bold">{b.name}</p>
                  <p className="text-xs">
                    {b.price?.toFixed(2)} € – Stock: {b.stock}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  className="comic-look text-xs px-2 py-1"
                  onClick={() =>
                    updateBeverage.mutate({
                      id: b.id,
                      stock: (b.stock ?? 0) + 5,
                    } as any)
                  }
                >
                  +5
                </button>
                <button
                  className="comic-look text-xs px-2 py-1"
                  onClick={() =>
                    updateBeverage.mutate({
                      id: b.id,
                      stock: (b.stock ?? 0) + 10,
                    } as any)
                  }
                >
                  +10
                </button>
                <button
                  className="comic-look bg-red-100 text-xs px-2 py-1"
                  onClick={() => deleteBeverage.mutate(b.id)}
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="comic-card bg-white p-4">
        <h2 className="font-bold text-xl mb-3">Nutzer-Vorschläge</h2>
        {suggestions?.map((s) => (
          <li
            key={s.id}
            className="border-2 border-black rounded p-3 list-none mb-2"
          >
            <p className="font-bold">{s.name}</p>
            <p className="text-sm">{s.description}</p>
            <div className="flex gap-2 mt-2">
              <button
                className="comic-look bg-green-200 px-3 py-1 text-sm"
                onClick={() => rejectSuggestion.mutate(s.id)}
              >
                Erledigt
              </button>
              <button
                className="comic-look bg-red-200 px-3 py-1 text-sm"
                onClick={() => rejectSuggestion.mutate(s.id)}
              >
                Ablehnen
              </button>
            </div>
            <p className="text-xs opacity-60 mt-1 text-red-500">
              Achtung: nach Erledigt müssen Bestand, Preis und Bild manuell
              ergänzt werden!
            </p>
          </li>
        ))}
      </div>

      <div className="comic-card bg-white p-4">
        <h2 className="font-bold text-xl mb-3">User innerhalb Organisation</h2>
        <ul className="flex flex-col">
          {orgUsers?.map((u) => (
            <li
              key={u.id}
              className="flex justify-between items-center py-2 text-sm list-none border-b"
            >
              <span>
                {u.name} – {u.role} {u.is_active ? "✅" : "⏳ wartet"}
              </span>
              <div className="flex gap-2">
                {!u.is_active && (
                  <button
                    className="comic-look bg-green-100 px-2 py-1 text-xs"
                    onClick={() => activateUser.mutate(u.id)}
                  >
                    Freigeben
                  </button>
                )}
                <button
                  className="comic-look bg-red-100 px-2 py-1 text-xs hover:bg-red-200"
                  onClick={async () => {
                    if (!confirm(`${u.name} wirklich löschen?`)) return;
                    try {
                      await deleteUser.mutateAsync(u.id);
                      console.log("gelöscht:", u.id);
                    } catch (e: any) {
                      console.error("Delete Fehler:", e.response?.data);
                      alert(
                        "Löschen fehlgeschlagen: " + e.response?.data?.message,
                      );
                    }
                  }}
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
