"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Boxes, History, Home, LogOut, Plus, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";
import { useOnline } from "@/hooks/use-online";
import { useStockRealtime } from "@/hooks/use-stock-realtime";
import type { Profile } from "@/types/domain";

const navItems = [
  { href: "/dashboard", label: "Tổng quan", icon: Home },
  { href: "/kho", label: "Kho", icon: Boxes },
  { href: "/kho/them", label: "Thêm", icon: Plus },
  { href: "/thong-ke", label: "Thống kê", icon: BarChart3 },
  { href: "/lich-su", label: "Lịch sử", icon: History }
];

export function AppShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const online = useOnline();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const refreshable = pathname === "/dashboard" || pathname === "/kho" || pathname === "/thong-ke" || pathname === "/lich-su" || pathname === "/admin";
  useStockRealtime(online, refreshable);

  const items = useMemo(
    () => (profile.role === "ADMIN" ? [...navItems, { href: "/admin", label: "Admin", icon: ShieldCheck }] : navItems),
    [profile.role]
  );

  useEffect(() => {
    items.forEach((item) => router.prefetch(item.href));
    router.prefetch("/kho/them");
  }, [items, router]);

  useEffect(() => {
    setNavigatingTo(null);
  }, [pathname]);

  function handleNavigate(href: string) {
    if (href !== pathname) setNavigatingTo(href);
  }

  async function handleLogout() {
    await createClient().auth.signOut();
    toast.success("Đã đăng xuất");
    router.replace("/login");
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      {navigatingTo ? (
        <div className="fixed left-0 right-0 top-0 z-50 h-1 overflow-hidden bg-mint/15">
          <div className="h-full w-1/2 animate-[slide-progress_0.9s_ease-in-out_infinite] bg-mint" />
        </div>
      ) : null}

      <aside className="hidden border-r border-border bg-surface/80 px-4 py-5 lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-mint text-xl font-black text-slate-950">K</div>
          <div>
            <p className="font-bold text-slate-50">Kho Máy CTV</p>
            <p className="text-xs text-slate-400">iPhone tồn kho chung</p>
          </div>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-300 transition hover:bg-white/8",
                  active && "bg-mint/14 text-mint"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-lg border border-border bg-background/50 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <UserRound className="h-4 w-4 text-mint" />
            {profile.full_name}
          </div>
          <p className="mt-1 text-xs text-slate-400">{profile.role}</p>
          <button onClick={handleLogout} className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-mint">
            <LogOut className="h-4 w-4" /> Đăng xuất
          </button>
        </div>
      </aside>

      <main className="safe-bottom min-w-0 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        {!online && (
          <div className="mb-4 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-amber-100">
            Đang offline. Danh sách sẽ tải lại khi có mạng; thao tác bán hàng tạm khóa.
          </div>
        )}
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur lg:hidden">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-semibold text-slate-400",
                  active && "bg-mint/14 text-mint"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
