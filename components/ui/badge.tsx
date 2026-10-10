import { cn } from "@/lib/utils";
import type React from "react";

const tones = {
  mint: "border-mint/30 bg-mint/12 text-mint",
  warning: "border-warning/30 bg-warning/12 text-amber-200",
  danger: "border-danger/30 bg-danger/12 text-rose-200",
  muted: "border-border bg-white/5 text-slate-300"
};

export function Badge({
  children,
  tone = "muted",
  className
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}
