"use client";

import { useAuth } from "@/app/context/AuthContext"; //Auth Context, da drin steckt logout()
import { useRouter } from "next/navigation"; // Next.js Router um Seiten zu wechseln (push)
import { useQueryClient } from "@tanstack/react-query"; // Damit können  den TanStack Cache leeren

export function LogoutButton() {
  //  Alles holen was der Logout braucht
  const { logout } = useAuth(); // logout = Funktion die Token löscht, User ausloggt
  const router = useRouter(); // router.push("/") = gehe zu Startseite
  const queryClient = useQueryClient(); // queryClient = Der Cache Speicher von allen useQuery Hooks

  //  Was passiert wenn man auf Logout klickt?
  const handleLogout = () => {
    logout(); //  Löscht accessToken aus Context + localStorage / cookies. Danach ist man nicht mehr eingeloggt
    queryClient.clear(); //  Löscht ALLE gecachten Daten (Orgs, Profiles, Beverages etc.). Wichtig, sonst sieht nächster User noch alte Daten!
    router.push("/"); // Leitet auf Startseite "/" weiter
  };

  //  Der eigentliche Button
  return (
    <button
      onClick={handleLogout} // Beim Klick handleLogout ausführen
      className="comic-look bg-red-200 px-4 py-2 text-sm font-bold"
    >
      Logout
    </button>
  );
}
