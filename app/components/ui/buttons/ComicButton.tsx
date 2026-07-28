import * as React from "react";
import { cn } from "../../../lib/utils";

export interface ComicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export function ComicButton({
  className,
  children,
  text,
  type = "button",
  ...props
}: ComicButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-[0.4em] border-[3px] border-black",
        "bg-[#fbca1f] px-[1.3em] py-[0.6em]",
        "font-inherit text-[16px] font-black text-black",
        "shadow-[0.1em_0.1em_0_#000]",
        "transition-transform duration-150 ease-out transition-shadow",
        "hover:-translate-x-[0.05em] hover:-translate-y-[0.05em]",
        "hover:shadow-[0.15em_0.15em_0_#000]",
        "active:translate-x-[0.05em] active:translate-y-[0.05em]",
        "active:shadow-[0.05em_0.05em_0_#000]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:active:translate-x-0 disabled:active:translate-y-0",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
        className,
      )}
      {...props}
    >
      {children ?? text ?? "Button"}
    </button>
  );
}

export default ComicButton;
