// -- app/lib/utils.ts --
// Kleine Utility-Funktionen für das UI/Styling.
// Zweck:
// - cn: Kombiniert CSS-Klassen sicher (clsx) und führt Tailwind-Klassen-Merging
//   mit tailwind-merge durch, um doppelte/konfliktierende Klassen zu bereinigen.
// Verwendung:
// - Wird in Komponenten verwendet, um dynamische className-Zusammenfügungen
//   korrekt und konsistent zu handhaben.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
