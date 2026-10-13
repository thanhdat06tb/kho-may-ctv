import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
};

const variants = {
  primary: "bg-mint text-slate-950 shadow-[0_12px_28px_rgba(45,212,191,0.20)] hover:bg-teal-300",
  secondary: "bg-panel text-slate-100 border border-border hover:border-mint/70 hover:bg-[#182a43]",
  danger: "bg-danger text-white hover:bg-rose-400",
  ghost: "bg-transparent text-slate-200 hover:bg-white/8"
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  icon: "h-11 w-11 p-0"
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
