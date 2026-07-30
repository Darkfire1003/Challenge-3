"use client";

import { useState } from "react";
import Image from "next/image";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { ComicButton } from "../ui/buttons/ComicButton";

const AVATAR_COUNT = 116;
const avatarOptions = Array.from(
  { length: AVATAR_COUNT },
  (_, i) => `avatars/Number=${i + 1}.png`,
);

export default function ProfileEditModal({
  currentName,
  currentAvatar,
  onClose,
}: {
  currentName: string;
  currentAvatar: string | null;
  onClose: () => void;
}) {
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState(currentName);
  const [avatar, setAvatar] = useState(currentAvatar ?? avatarOptions[0]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProfile.mutate({ name, avatar_path: avatar }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="comic-look w-full max-w-md bg-white p-6">
        <h2 className="text-center text-lg font-semibold text-secon">
          Profil bearbeiten
        </h2>

        <form onSubmit={handleSave} className="mt-4 flex flex-col gap-3">
          <label htmlFor="name" className="text-sm text-secon">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded outline-none"
          />

          <p className="mt-2 text-sm text-secon">Avatar wählen</p>
          <div className="grid max-h-48 grid-cols-5 gap-2 overflow-y-auto">
            {avatarOptions.map((path) => (
              <button
                key={path}
                type="button"
                onClick={() => setAvatar(path)}
                className={`rounded-lg border-2 p-1 ${
                  avatar === path ? "border-btn" : "border-transparent"
                }`}
              >
                <Image
                  src={`/${path}`}
                  alt="Avatar"
                  width={48}
                  height={48}
                  className="h-auto w-full"
                />
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-3">
            <ComicButton
              type="button"
              onClick={onClose}
              className="bg-white px-4 py-1.5 text-secon"
            >
              Abbrechen
            </ComicButton>
            <ComicButton
              type="submit"
              disabled={updateProfile.isPending}
              className="bg-btn px-4 py-1.5 text-white disabled:opacity-40"
            >
              Speichern
            </ComicButton>
          </div>
        </form>
      </div>
    </div>
  );
}
