"use client";

import { useState, useMemo } from "react";
import { useGetOrganizations } from "@/hooks/useGetOrganizations";
import { useCreateOrganization } from "@/hooks/useCreateOrganization";
import { useUpdateOrganization } from "@/hooks/useUpdateOrganization";
import { useDeleteOrganization } from "@/hooks/useDeleteOrganization";
import { useGetOrganizationAdmins } from "@/hooks/useGetOrganizationAdmins";
import { useAddOrganizationAdmin } from "@/hooks/useAddOrganizationAdmin";
import { useRemoveOrganizationAdmin } from "@/hooks/useRemoveOrganizationAdmin";
import { useGetAllProfiles } from "@/hooks/useGetAllProfiles";

export default function OrganizationManager() {
  const { data, isLoading, isError, error, isFetching } = useGetOrganizations();
  const createItem = useCreateOrganization();
  const updateItem = useUpdateOrganization();
  const deleteItem = useDeleteOrganization();
  const { data: allProfiles } = useGetAllProfiles();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data: admins } = useGetOrganizationAdmins(selectedOrgId || "");
  const addAdmin = useAddOrganizationAdmin();
  const removeAdmin = useRemoveOrganizationAdmin();

  const availableUsers = useMemo(() => {
    if (!allProfiles) return [];
    const adminIds = new Set(admins?.map((a) => a.id));
    return allProfiles.filter(
      (p) =>
        !adminIds.has(p.id) &&
        p.role !== "admin" &&
        (p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase())),
    );
  }, [allProfiles, admins, search]);

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

  if (isLoading) return <p>Lädt…</p>;
  if (isError) return <p>Fehler: {error.message}</p>;

  return (
    <section className="max-w-4xl mx-auto p-4">
      {isFetching && <p>Aktualisiere…</p>}

      <form
        onSubmit={handleCreate}
        className="comic-card bg-white mb-6 p-4 flex flex-col gap-2"
      >
        <h2 className="font-bold text-secon">Neue Organisation anlegen</h2>
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
            <h2 className="font-bold text-lg">{item.name}</h2>
            <p className="text-sm opacity-70">{item.address}</p>

            <div className="flex gap-2 mt-2 flex-wrap">
              <button
                className="comic-look px-3 py-1 text-sm"
                onClick={() =>
                  updateItem.mutate({
                    id: item.id,
                    name: `${item.name} (updated)`,
                  })
                }
              >
                Update
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

            {selectedOrgId === item.id && (
              <div className="mt-4 border-t-2 border-black pt-3">
                <h3 className="font-bold">Aktuelle Org-Admins</h3>
                <ul className="mt-2">
                  {admins?.length === 0 && (
                    <li className="text-sm opacity-60">
                      Noch keine Org-Admins
                    </li>
                  )}
                  {admins?.map((admin) => (
                    <li
                      key={admin.id}
                      className="flex justify-between items-center py-1"
                    >
                      <span>
                        {admin.name || admin.id}{" "}
                        <span className="text-xs opacity-50">
                          ({admin.id.slice(0, 8)}...)
                        </span>
                      </span>
                      <button
                        className="text-xs comic-look px-2 py-1 bg-red-100"
                        onClick={() =>
                          removeAdmin.mutate({ profileId: admin.id })
                        }
                      >
                        Entfernen
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <h4 className="font-bold text-sm">
                    Neuen Org-Admin hinzufügen
                  </h4>
                  <input
                    className="border-2 border-black rounded p-1 w-full mt-2"
                    placeholder="Nach Name oder ID suchen..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="max-h-40 overflow-auto border border-black rounded mt-2">
                    {availableUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex justify-between items-center p-2 hover:bg-gray-100 text-sm"
                      >
                        <span>
                          {user.name || "Ohne Name"}{" "}
                          <span className="text-xs opacity-50">
                            {user.role}
                          </span>
                        </span>
                        <button
                          className="comic-look px-2 py-1 text-xs"
                          disabled={addAdmin.isPending}
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
                    {availableUsers.length === 0 && (
                      <p className="p-2 text-xs opacity-60">
                        Keine passenden User gefunden
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
