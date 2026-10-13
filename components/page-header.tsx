import type React from "react";
import { BackButton } from "@/components/back-button";

export function PageHeader({
  title,
  description,
  action,
  showBack = false,
  backFallbackHref = "/dashboard"
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  showBack?: boolean;
  backFallbackHref?: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {showBack ? <BackButton fallbackHref={backFallbackHref} /> : null}
        <div className="min-w-0">
          <h1 className="break-words text-[1.65rem] font-bold leading-tight tracking-normal text-slate-50 sm:text-2xl">{title}</h1>
          {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="flex w-full sm:w-auto [&_a]:w-full [&_button]:w-full sm:[&_a]:w-auto sm:[&_button]:w-auto">{action}</div> : null}
    </div>
  );
}
