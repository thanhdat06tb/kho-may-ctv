"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton({ fallbackHref = "/dashboard" }: { fallbackHref?: string }) {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }

  return (
    <Button type="button" variant="secondary" size="icon" aria-label="Quay lại" title="Quay lại" onClick={handleBack}>
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}
