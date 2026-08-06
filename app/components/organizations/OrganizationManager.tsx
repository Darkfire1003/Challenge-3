"use client";

import { useState } from "react";
import { useGetOrganizations } from "@/hooks/useGetOrganizations";
import { useCreateOrganization } from "@/hooks/useCreateOrganization";
import { useUpdateOrganization } from "@/hooks/useUpdateOrganization";
import { useDeleteOrganization } from "@/hooks/useDeleteOrganization";
import { useGetOrganizationAdmins } from "@/hooks/useGetOrganizationAdmins";
import { useAddOrganizationAdmin } from "@/hooks/useAddOrganizationAdmin";
import { useRemoveOrganizationAdmin } from "@/hooks/useRemoveOrganizationAdmin";
import { useGetAllProfiles } from "@/hooks/useGetAllProfiles";
import { LogoutButton } from "@/app/components/LogoutButton";

export default function OrganizationManager() {
  //daten aus db holen
  const { data, isLoading, isError, error, isFetching } = useGetOrganizations();
  // data = Array mit allen Orgs, z.B. [{id: "1", name: "Firma A"},...]
  // isLoading = true nur beim allerersten Laden
  // isFetching = true auch wenn im Hintergrund neu geladen wird
  // isError / error = Falls laden scheitern sollte

  const createItem = useCreateOrganization(); // Damit später createItem.mutate() aufrufen
  const updateItem = useUpdateOrganization(); // Damit updateItem.mutate() aufrufen
  const deleteItem = useDeleteOrganization(); // Damit deleteItem.mutate() aufrufen
  const { data: allProfiles, isLoading: profilesLoading } = useGetAllProfiles(); // Alle User für die Liste unten

  // Formular neue ORG
  const [name, setName] = useState(""); // Was steht gerade im Input "Name"?
  const [address, setAddress] = useState(""); // Was steht gerade im Input "Adresse"?
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null); // Welche Org ist gerade aufgeklappt? null = keine
  const [search, setSearch] = useState(""); // Was tippt der User ins Suchfeld "Suche Name oder Email"?

  // states während dem bearbeiten
  const [editId, setEditId] = useState<string | null>(null); // Welche Org wird gerade bearbeitet? Wenn null, wird keine bearbeitet
  const [editName, setEditName] = useState(""); // Temporärer Name während dem Bearbeiten
  const [editAddress, setEditAddress] = useState(""); // Temporäre Adresse während dem Bearbeiten

  // admin von ausgeklappter org laden
  // selectedOrgId || "" heißt: Wenn keine Org ausgewählt ist, nimm leeren String. Der Hook lädt dann nichts wegen enabled:!!id
  const { data: admins } = useGetOrganizationAdmins(selectedOrgId || "");
  const addAdmin = useAddOrganizationAdmin(); // Funktion um User zum Admin zu machen
  const removeAdmin = useRemoveOrganizationAdmin(); // Funktion um Admin zu entfernen

  // neue org anlegen wenn formular abgeschickt wirrd
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault(); // Verhindert dass die Seite neu lädt, normales Verhalten bei <form>
    if (!name.trim()) return; // Wenn Name nur Leerzeichen ist, abbrechen
    createItem.mutate(
      { name, address }, // Diese Daten gehen an Supabase: INSERT INTO organizations
      {
        onSuccess: () => {
          // Wenn es geklappt hat:
          setName(""); // Input Feld leeren
          setAddress(""); // Input Feld leeren
        },
      },
    );
  };

  // speichern der bearbeitung
  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return; // Kein leerer Name erlaubt
    updateItem.mutate(
      { id, name: editName, address: editAddress }, // PATCH /organizations?id=eq.id
      { onSuccess: () => setEditId(null) }, // Nach Erfolg: Edit Modus schließen
    );
  };

  // wie wird ein user angzeigt?
  // Manchmal hat ein User kein .name, dann werden fallbacks probiert
  const getDisplayName = (user: any) => {
    return (
      user.name || // Versuch 1: normales name Feld
      user.raw_user_meta_data?.name || // Versuch 2: Name aus Auth Daten
      user.email?.split("@")[0] || // Versuch 3: Alles vor dem @ aus der Email
      user.id.slice(0, 8) // Versuch 4: Erste 8 Buchstaben der ID als Notfall
    );
  };

  // Helper: Org Namen eines Users anzeigen
  const getOrgName = (user: any) => {
    return user.organizations?.name || user.organization_name || "keine Org";
  };

  // wENN NOCH AM LADEN ODER FEHLER, ZEIGE DAS AN UND BRICH AB
  if (isLoading) return <p>Lädt…</p>;
  if (isError) return <p>Fehler: {error.message}</p>;

  return (
    <section className="max-w-4xl mx-auto p-4">
      {/* Kopfzeile mit Admin Titel und Logout Button */}
      <div className="flex justify-between items-center w-full border-2 border-black p-2 bg-white mb-5">
        <h1 className="font-bold">Admin</h1>
        <LogoutButton />
      </div>
      {/* Wird angezeigt wenn im Hintergrund neu geladen wird */}
      {isFetching && <p className="text-xs">Aktualisiere…</p>}

      {/* FORMULAR ZUM ERSTELLEN EINER NEUEN ORG */}
      <form
        onSubmit={handleCreate}
        className="comic-card bg-white mb-6 p-4 flex flex-col gap-2"
      >
        <h2 className="font-bold">Neue Organisation anlegen</h2>
        <input
          className="border-2 border-black rounded p-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Bei jedem Tippen den State updaten
        />
        <input
          className="border-2 border-black rounded p-2"
          placeholder="Adresse"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          type="submit"
          disabled={createItem.isPending} // Button nicht klickbar solange Speichern läuft
          className="comic-look px-4 py-2 font-bold"
        >
          Erstellen
        </button>
      </form>

      {/* LISTE ALLER ORGANISATIONEN */}
      <ul className="flex flex-col gap-4">
        {data?.map(
          (
            item, // Für jede Org in der DB eine Karte rendern
          ) => (
            <li key={item.id} className="comic-card bg-white p-4">
              {/* WENN DIESE ORG GERADE BEARBEITET WIRD (editId == item.id) */}
              {editId === item.id ? (
                <div className="flex flex-col gap-2">
                  <input
                    className="border-2 border-black rounded p-2"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    className="border-2 border-black rounded p-2"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      className="comic-look bg-green-200 px-3 py-1 text-sm"
                      onClick={() => handleSaveEdit(item.id)} // Speichern Button
                    >
                      Speichern
                    </button>
                    <button
                      className="comic-look bg-gray-100 px-3 py-1 text-sm"
                      onClick={() => setEditId(null)} // Abbrechen = Edit Modus verlassen
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                // NORMAL ANZEIGE (nicht im Edit Modus)
                <>
                  <h2 className="font-bold text-lg">{item.name}</h2>
                  <p className="text-sm opacity-70">{item.address}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <button
                      className="comic-look px-3 py-1 text-sm"
                      onClick={() => {
                        setEditId(item.id); // In Edit Modus gehen
                        setEditName(item.name); // Aktuellen Namen ins Edit Feld kopieren
                        setEditAddress(item.address || ""); // Aktuelle Adresse kopieren
                      }}
                    >
                      Bearbeiten
                    </button>
                    <button
                      className="comic-look bg-red-200 px-3 py-1 text-sm"
                      onClick={() => deleteItem.mutate(item.id)} // Diese Org löschen
                    >
                      Löschen
                    </button>
                    <button
                      className="comic-look bg-bgCard px-3 py-1 text-sm"
                      onClick={() => {
                        setSelectedOrgId(item.id); // Diese Org aufklappen um Admins zu sehen
                        setSearch(""); // Suchfeld leeren
                      }}
                    >
                      Admins verwalten
                    </button>
                  </div>
                </>
              )}

              {/* ADMIN BEREICH - WIRD NUR GEZEIGT WENN selectedOrgId == diese Org ist */}
              {selectedOrgId === item.id && (
                <div className="mt-4 border-t-2 border-black pt-3">
                  <h3 className="font-bold text-sm">Aktuelle Org-Admins</h3>
                  <ul className="mt-2 mb-4">
                    {/* Liste der aktuellen Admins dieser Org */}
                    {admins?.map((a: any) => (
                      <li
                        key={a.id}
                        className="flex justify-between py-1 text-sm"
                      >
                        <span>
                          {a.name ||
                            a.raw_user_meta_data?.name ||
                            a.id.slice(0, 8)}
                        </span>
                        <button
                          className="comic-look bg-red-100 px-2 py-1 text-xs"
                          onClick={() =>
                            removeAdmin.mutate({ profileId: a.id })
                          } // Admin Recht wegnehmen
                        >
                          Entfernen
                        </button>
                      </li>
                    ))}
                    {admins?.length === 0 && (
                      <li className="text-xs opacity-60">Noch keine</li> // Wenn keine Admins da sind
                    )}
                  </ul>

                  {/* SUCHFELD UM USER ZU FINDEN */}
                  <input
                    className="border-2 border-black rounded p-2 w-full text-sm"
                    placeholder="Suche Name oder Email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} // Suchtext merken
                  />

                  {/* LISTE ALLER USER AUS DER DB ZUM HINZUFÜGEN */}
                  <div className="max-h-60 overflow-auto border-2 border-black rounded mt-2 bg-white">
                    {profilesLoading && (
                      <p className="p-2 text-xs">Lade User...</p>
                    )}
                    {allProfiles
                      ?.filter((p: any) => {
                        // FILTER REGELN:
                        const isAlreadyAdmin = admins?.some(
                          (a: any) => a.id === p.id,
                        );
                        if (isAlreadyAdmin) return false; // Regel 1: Wer schon Admin ist, nicht mehr anzeigen
                        if (!search) return true; // Regel 2: Wenn kein Suchtext, alle anzeigen
                        // Regel 3: Nur anzeigen wenn Name oder Email den Suchtext enthält
                        const hay =
                          `${getDisplayName(p)} ${p.email || ""}`.toLowerCase();
                        return hay.includes(search.toLowerCase());
                      })
                      .map((user: any) => (
                        <div
                          key={user.id}
                          className="flex justify-between items-center p-2 hover:bg-gray-100 text-sm border-b last:border-0"
                        >
                          <span>
                            <b>{getDisplayName(user)}</b>{" "}
                            <span className="text- opacity-60">
                              {user.email} - {getOrgName(user)}
                            </span>
                          </span>
                          <button
                            // disabled wenn schon 1 Admin existiert - nur 1 Admin pro Org
                            disabled={(admins?.length ?? 0) >= 1}
                            className="comic-look px-2 py-1 text-xs disabled:opacity-30" // ausgegraut wenn disabled
                            onClick={() =>
                              // Macht diesen User zum org_admin für diese Org
                              addAdmin.mutate({
                                profileId: user.id,
                                organizationId: item.id,
                              })
                            }
                          >
                            Hinzufügen
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
