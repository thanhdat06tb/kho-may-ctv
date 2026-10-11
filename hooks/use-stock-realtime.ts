"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export function useStockRealtime(enabled = true, refreshable = true) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;
    const supabase = createClient();
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleRefresh = () => {
      if (!refreshable) return;
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => router.refresh(), 700);
    };
    const channel = supabase
      .channel("stock-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "phones" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "sales" }, scheduleRefresh)
      .subscribe();

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      supabase.removeChannel(channel);
    };
  }, [enabled, refreshable, router]);
}
