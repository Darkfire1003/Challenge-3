// -- pop-button.tsx --
// Stilistischer Pop-Button (wiederverwendete UI-Komponente).
// Zweck:
// - Bietet eine dekorative, wiederverwendbare Button-Variante mit Pop-/Shadow-Effekt.
// - Vereinfacht konsistentes Styling für Hover-, Active- und Disabled-Zustände.
// Eingaben:
// - Übergibt alle üblichen Button-Attribute via React.ButtonHTMLAttributes.
// Laufzeit:
// - Rein clientseitig, rein visuelle Darstellung, keine Netzwerk- oder Auth-Logik.
// Verwendung:
// - Importieren und wie ein normaler <button> verwenden; className wird gemerged.

import React from "react";
import { cn } from "../../../lib/utils";

export type PopButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function PopButton({
  className,
  children = "Learn More",
  ...props
}: PopButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center font-semibold uppercase text-[#382b22] dark:text-[#382b22]",
        "px-8 py-5 rounded-xl bg-[#fff0f0] border-2 border-[#b18597]",
        "transition-all duration-150 ease-[cubic-bezier(0,0,0.58,1)]",
        "shadow-[0_12px_0_-2px_#f9c4d2,0_12px_0_0_#b18597,0_22px_0_0_#ffe3e2]",
        "dark:shadow-[0_12px_0_-2px_#f9c4d2,0_12px_0_0_#b18597,0_22px_15px_-5px_rgba(0,0,0,0.3)]",
        "hover:bg-[#ffe9e9] hover:translate-y-1 hover:shadow-[0_8px_0_-2px_#f9c4d2,0_8px_0_0_#b18597,0_16px_0_0_#ffe3e2]",
        "dark:hover:shadow-[0_8px_0_-2px_#f9c4d2,0_8px_0_0_#b18597,0_16px_10px_-5px_rgba(0,0,0,0.3)]",
        "active:bg-[#ffe9e9] active:translate-y-3 active:shadow-[0_0px_0_-2px_#f9c4d2,0_0px_0_0_#b18597,0_0px_0_0_#ffe3e2]",
        "dark:active:shadow-[0_0px_0_-2px_#f9c4d2,0_0px_0_0_#b18597,0_0px_0_0_rgba(0,0,0,0)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default PopButton;
