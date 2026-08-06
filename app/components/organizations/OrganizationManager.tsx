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
  const { data, isLoading, isError, error, isFetching } = useGetOrganizations();
  const createItem = useCreateOrganization();
  const updateItem = useUpdateOrganization();
  const deleteItem = useDeleteOrganization();
  const { data: allProfiles, isLoading: profilesLoading } = useGetAllProfiles();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const { data: admins } = useGetOrganizationAdmins(selectedOrgId || "");
  const addAdmin = useAddOrganizationAdmin();
  const removeAdmin = useRemoveOrganizationAdmin();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createItem.mutate(
      { name, address },
      {
        onSuccess: () => {
          setName("");
          setAddress("");
        },
      },
    );
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    updateItem.mutate(
      { id, name: editName, address: editAddress },
      { onSuccess: () => setEditId(null) },
    );
  };

  const getDisplayName = (user: any) => {
    return (
      user.name ||
      user.raw_user_meta_data?.name ||
      user.email?.split("@")[0] ||
      user.id.slice(0, 8)
    );
  };

  const getOrgName = (user: any) => {
    return user.organizations?.name || user.organization_name || "keine Org";
  };

  if (isLoading) return <p>Lädt…</p>;
  if (isError) return <p>Fehler: {error.message}</p>;

  return (
    <section className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center w-full border-2 border-black p-2 bg-white mb-5">
        <h1 className="font-bold">Admin</h1>
        <LogoutButton />
      </div>
      {isFetching && <p className="text-xs">Aktualisiere…</p>}

      <form
        onSubmit={handleCreate}
        className="comic-card bg-white mb-6 p-4 flex flex-col gap-2"
      >
        <h2 className="font-bold">Neue Organisation anlegen</h2>
        <input
          className="border-2 border-black rounded p-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border-2 border-black rounded p-2"
          placeholder="Adresse"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          type="submit"
          disabled={createItem.isPending}
          className="comic-look px-4 py-2 font-bold"
        >
          Erstellen
        </button>
      </form>

      <ul className="flex flex-col gap-4">
        {data?.map((item) => (
          <li key={item.id} className="comic-card bg-white p-4">
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
                    onClick={() => handleSaveEdit(item.id)}
                  >
                    Speichern
                  </button>
                  <button
                    className="comic-look bg-gray-100 px-3 py-1 text-sm"
                    onClick={() => setEditId(null)}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-bold text-lg">{item.name}</h2>
                <p className="text-sm opacity-70">{item.address}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button
                    className="comic-look px-3 py-1 text-sm"
                    onClick={() => {
                      setEditId(item.id);
                      setEditName(item.name);
                      setEditAddress(item.address || "");
                    }}
                  >
                    Bearbeiten
                  </button>
                  <button
                    className="comic-look bg-red-200 px-3 py-1 text-sm"
                    onClick={() => deleteItem.mutate(item.id)}
                  >
                    Löschen
                  </button>
                  <button
                    className="comic-look bg-bgCard px-3 py-1 text-sm"
                    onClick={() => {
                      setSelectedOrgId(item.id);
                      setSearch("");
                    }}
                  >
                    Admins verwalten
                  </button>
                </div>
              </>
            )}

            {selectedOrgId === item.id && (
              <div className="mt-4 border-t-2 border-black pt-3">
                <h3 className="font-bold text-sm">Aktuelle Org-Admins</h3>
                <ul className="mt-2 mb-4">
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
                        onClick={() => removeAdmin.mutate({ profileId: a.id })}
                      >
                        Entfernen
                      </button>
                    </li>
                  ))}
                  {admins?.length === 0 && (
                    <li className="text-xs opacity-60">Noch keine</li>
                  )}
                </ul>

                <input
                  className="border-2 border-black rounded p-2 w-full text-sm"
                  placeholder="Suche Name oder Email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="max-h-60 overflow-auto border-2 border-black rounded mt-2 bg-white">
                  {profilesLoading && (
                    <p className="p-2 text-xs">Lade {15} User...</p>
                  )}
                  {allProfiles
                    ?.filter((p: any) => {
                      const isAlreadyAdmin = admins?.some(
                        (a: any) => a.id === p.id,
                      );
                      if (isAlreadyAdmin) return false;
                      if (!search) return true;
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
                          disabled={(admins?.length ?? 0) >= 1}
                          className="comic-look px-2 py-1 text-xs disabled:opacity-30"
                          onClick={() =>
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
        ))}
      </ul>
    </section>
  );
}
