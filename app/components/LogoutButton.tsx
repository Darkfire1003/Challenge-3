"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    queryClient.clear();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="comic-look bg-red-200 px-4 py-2 text-sm font-bold"
    >
      Logout
    </button>
  );
}
