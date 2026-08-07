// -- GoldenButton.tsx --
// Wiederverwendete Button-Komponente mit goldigem, stilisiertem Look.
// Zweck:
// - Bietet eine wiederverwendbare Schaltfläche mit goldener Oberfläche und unterschiedlichen Größen.
// - Wird in Formularen und an hervorgehobenen Stellen der UI eingesetzt.
// Eingaben (Props):
// - text: Anzeigentext
// - size: 'sm' | 'md' | 'lg' (wählt gewünschte Style-Set)
// - className: zusätzliche CSS-Klassen
// Laufzeit/Kontext:
// - Rein visuelle Komponente, kein Netzwerkzugriff oder Auth-Logik.
// - Nutzt cn (tailwind-merge + clsx) um className-Kombinationen sicher zu verbinden.
import * as React from "react";
import { cn } from "../../../lib/utils";

type GoldenButtonProps = {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const sizeStyles = {
  sm: "h-9 px-3 text-sm rounded-md",
  md: "h-11 px-4 text-base rounded-md",
  lg: "h-12 px-6 text-base rounded-lg",
};

// -- GoldenButton --
// Diese Hilfstabelle definiert die Standardgrößen der Button-Komponente.
// Sie wird für das responsive Styling in der Darstellung verwendet.

export function GoldenButton({
  text = "Golden Button",
  size = "md",
  className,
  type = "button",
  ...props
}: GoldenButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex select-none items-center justify-center",
        "whitespace-nowrap font-medium uppercase tracking-wide",
        "leading-none touch-manipulation outline-none",
        "border transition-all duration-200 ease-in-out",
        "border-[#a55d07] text-[rgb(120,50,5)]",
        "shadow-[0_3px_6px_rgba(0,0,0,0.16),0_3px_6px_rgba(110,80,20,0.4),inset_0_-2px_5px_1px_rgba(139,66,8,1),inset_0_-1px_1px_3px_rgba(250,227,133,1)]",
        "bg-[linear-gradient(160deg,#a54e07,#b47e11,#fef1a2,#bc881b,#a54e07)]",
        "bg-100%_100% bg-center bg-no-repeat",
        "[text-shadow:0_2px_2px_rgba(250,227,133,1)]",
        "hover:bg-150%_150% hover:border-[rgba(165,93,7,0.6)] hover:text-[rgba(120,50,5,0.8)]",
        "hover:shadow-[0_10px_20px_rgba(0,0,0,0.19),0_6px_6px_rgba(0,0,0,0.23),inset_0_-2px_5px_1px_#b17d10,inset_0_-1px_1px_3px_rgba(250,227,133,1)]",
        "focus-visible:ring-2 focus-visible:ring-amber-300/70 focus-visible:ring-offset-2",
        "active:translate-y-px",
        "active:shadow-[0_3px_6px_rgba(0,0,0,0.16),0_3px_6px_rgba(110,80,20,0.4),inset_0_-2px_5px_1px_#b17d10,inset_0_-1px_1px_3px_rgba(250,227,133,1)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "motion-reduce:transition-none",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      <span>{text}</span>
    </button>
  );
}
