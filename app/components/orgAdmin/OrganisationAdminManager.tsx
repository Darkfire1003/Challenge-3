"use client"; // Wichtig für Next.js: Diese Datei läuft im Browser nichht auf dem Server

import { useState, useMemo } from "react";
import { useProfile } from "@/hooks/useProfile"; // Holt mein eigenes Profil (wer bin ich, welche Org?)
import { useGetBeverages } from "@/hooks/useGetBeverages"; // Holt alle Getränke der Organisation
import { useCreateBeverage } from "@/hooks/useCreateBeverage"; // Hook zum Erstellen von Getränken
import { useUpdateBeverage } from "@/hooks/useUpdateBeverage"; // Hook zum Updaten von Getränken
import { useDeleteBeverage } from "@/hooks/useDeleteBeverage"; // Hook zum Löschen

import { useGetBeverageSuggestions } from "@/hooks/useGetBeverageSuggestions"; // Vorschläge von Usern
import { useRejectBeverageSuggestion } from "@/hooks/useRejectBeverageSuggestion"; // Vorschlag ablehnen/erledigt

import { LogoutButton } from "@/app/components/LogoutButton";

import { useGetOrganizationUsers } from "@/hooks/useGetOrganizationUsers"; // Alle User der Organisation laden
import { useActivateUser } from "@/hooks/useActivateUser"; // User freischalten
import { useDeleteUser } from "@/hooks/useDeleteUser"; // User löschen

export default function OrganisationAdminManager() {
  //  Profi Laden
  const { data: profile, isLoading: profileLoading } = useProfile();
  // profile = { id, organization_id, role,... } oder undefined wenn noch lädt
  // profileLoading = true solange es lädt

  //  orgId aus dem Profil. Wenn Profil noch nicht da orgId = null

  const orgId = profile?.organization_id || null;

  //  Getränke laden
  const {
    data: beverages, // Array aller Getränke
    isLoading, // Lädt gerade zum ersten Mal?
    isError, // Gab es einen Fehler?
    error, // Die Fehlermeldung
    isFetching, // Lädt gerade im Hintergrund neu?
  } = useGetBeverages();

  // Mutations bzw Funktionen die etwas in der DB ändern
  const createBeverage = useCreateBeverage();
  const updateBeverage = useUpdateBeverage();
  const deleteBeverage = useDeleteBeverage();

  // Vorschläge werden geladen - erst wenn orgId bekannt ist (wegen enabled im Hook)
  const { data: suggestions } = useGetBeverageSuggestions(orgId);
  const rejectSuggestion = useRejectBeverageSuggestion();

  // die user der org laden
  const { data: orgUsers } = useGetOrganizationUsers(orgId);
  const activateUser = useActivateUser();
  const deleteUser = useDeleteUser();

  // form states.für das "Neues Getränk anlegen" Formular
  // Jedes Input Feld hat seinen eigenen State
  const [newName, setNewName] = useState(""); // Name vom neuen Getränk
  const [newPrice, setNewPrice] = useState(""); // Preis als String, weil Input immer String liefert
  const [newStock, setNewStock] = useState(""); // Bestand als String
  const [newImageUrl, setNewImageUrl] = useState(""); // Bild URL

  // Warnliste für wenig Bestand
  // useMemo = merkt sich das Ergebnis und rechnet nur neu wenn sich beverages ändert
  // Filtert alle Getränke wo stock < 5 ist
  const lowStock = useMemo(
    () => beverages?.filter((b) => (b.stock ?? 0) < 5) || [], //?? 0 heißt: wenn stock null ist, nimm 0
    [beverages],
  );

  // wenn man auf Anlegen klickt:
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault(); // Verhindert dass die Seite neu lädt (Standard bei Formularen)
    if (!newName.trim() || !orgId) return; // Abbruch wenn kein Name oder keine Org

    // Ruft die Mutation auf die in useCreateBeverage definiert ist
    createBeverage.mutate(
      {
        organization_id: orgId, // Zu welcher Org gehört das Getränk
        name: newName,
        price: parseFloat(newPrice) || 0, // String "1.50" -> Zahl 1.5
        stock: parseInt(newStock) || 0, // String "10" -> Zahl 10
        is_available: true, // Neues Getränk ist direkt verfügbar
        description: null,
        image_path: newImageUrl || null, // Wenn leer, dann null in DB speichern
      } as any,
      {
        // onSuccess wird ausgeführt NACHDEM Supabase erfolgreich gespeichert hat
        onSuccess: () => {
          // Formular leeren
          setNewName("");
          setNewPrice("");
          setNewStock("");
          setNewImageUrl("");
        },
      },
    );
  };

  // Laden-Error anzeigen
  if (profileLoading || isLoading) return <p>Lädt…</p>; // Solange Profil oder Getränke laden
  if (isError) return <p>Fehler: {error.message}</p>; // Wenn Fehler beim Laden

  // Ansicht UI
  return (
    <section className="max-w-5xl mx-auto p-4 flex flex-col gap-8">
      {/* Header mit Logout */}
      <div className="flex justify-between items-center w-full border-2 border-black p-2 bg-white">
        <h1 className="font-bold">Admin</h1>
        <LogoutButton />
      </div>
      {isFetching && <p>Aktualisiere…</p>}{" "}
      {/* Zeigt an wenn im Hintergrund neu geladen wird */}
      {/* WARNBOX WENN WENIG BESTAND */}
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
      {/* GETRÄNKE VERWALTEN BLOCK */}
      <div className="comic-card bg-white p-4">
        <h2 className="font-bold text-xl mb-3">
          Getränke verwalten (Org: {profile?.organizations?.name})
        </h2>
        {/* Formular neues Getränk */}
        <form onSubmit={handleCreate} className="flex flex-col gap-2 mb-4">
          <div className="flex flex-wrap gap-2">
            <input
              className="border-2 border-black rounded p-2"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)} // Bei jedem Tippen State updaten
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
          {/* Live Vorschau wenn URL eingegeben wurde */}
          {newImageUrl && (
            <img
              src={newImageUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border-2 border-black"
            />
          )}
          <button
            type="submit"
            disabled={createBeverage.isPending} // Button disabled solange Speichern läuft
            className="comic-look px-4 py-2 w-fit"
          >
            {createBeverage.isPending ? "Speichert..." : "Anlegen"}
          </button>
        </form>

        {/* Liste aller Getränke */}
        <ul className="grid md:grid-cols-2 gap-3">
          {beverages?.map((b) => (
            <li
              key={b.id} // React braucht key bei.map
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
                {/* Stock +5 Button - ruft updateBeverage Mutation auf */}
                <button
                  className="comic-look text-xs px-2 py-1"
                  onClick={() =>
                    updateBeverage.mutate({
                      id: b.id,
                      stock: (b.stock ?? 0) + 5, // alten Stock +5
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
                {/* Verfügbar / Nicht verfügbar umschalten */}
                <button
                  className={`comic-look text-xs px-2 py-1 ${!b.is_available ? "bg-yellow-200" : ""}`}
                  onClick={() =>
                    updateBeverage.mutate({
                      id: b.id,
                      is_available: !b.is_available, // true wird zu false, false zu true
                    } as any)
                  }
                >
                  {b.is_available ? "Deaktivieren" : "Aktivieren"}
                </button>
                <button
                  className="comic-look bg-red-100 text-xs px-2 py-1"
                  onClick={() => deleteBeverage.mutate(b.id)} // Löschen nach ID
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* VORSCHLÄGE VON USERN */}
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
                onClick={() => rejectSuggestion.mutate(s.id)} // Löscht den Vorschlag aus DB
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
              Achtung: nach Erledigt muss das Getränk und Getränke verwalten
              manuell angelegt werden.
            </p>
          </li>
        ))}
      </div>
      {/* USER LISTE */}
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
                {/* Nur anzeigen wenn User noch nicht aktiv ist */}
                {!u.is_active && (
                  <button
                    className="comic-look bg-green-100 px-2 py-1 text-xs"
                    onClick={() => activateUser.mutate(u.id)} // Setzt is_active auf true
                  >
                    Freigeben
                  </button>
                )}
                <button
                  className="comic-look bg-red-100 px-2 py-1 text-xs hover:bg-red-200"
                  onClick={async () => {
                    if (!confirm(`${u.name} wirklich löschen?`)) return; // Sicherheitsabfrage
                    try {
                      await deleteUser.mutateAsync(u.id); // Wartet bis wirklich gelöscht
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
