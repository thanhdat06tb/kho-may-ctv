import Link from "next/link";
import { Activity, Boxes, CircleDollarSign, PackageCheck, Plus, Smartphone } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime, formatVnd } from "@/lib/format";
import { getDashboardStats } from "@/lib/data";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const cards = [
    { label: "Máy còn hàng", value: stats.availableCount, icon: Boxes },
    { label: "Máy đã bán", value: stats.soldCount, icon: PackageCheck },
    { label: "Doanh số hợp lệ", value: formatVnd(stats.totalRevenue), icon: CircleDollarSign },
    { label: "Bán trong tháng", value: stats.monthSalesCount, icon: Smartphone }
  ];

  return (
    <AppShell profile={stats.profile}>
      <PageHeader
        title="Tổng quan"
        description="Số liệu được đọc trực tiếp từ Supabase theo quyền tài khoản."
        action={
          <Link href="/kho/them">
            <Button>
              <Plus className="h-5 w-5" /> Thêm máy
            </Button>
          </Link>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="p-4">
                <Icon className="h-5 w-5 text-mint" />
                <p className="mt-3 text-sm text-slate-400">{card.label}</p>
                <p className="mt-1 text-2xl font-black text-slate-50">{card.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="mt-5">
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-mint" />
            <h2 className="font-bold text-slate-50">Hoạt động gần đây</h2>
          </div>
          <div className="space-y-3">
            {stats.logs.length ? (
              stats.logs.map((log) => (
                <div key={log.id} className="rounded-lg border border-border bg-background/50 p-3">
                  <p className="text-sm font-semibold text-slate-100">{log.action}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {log.profiles?.full_name ?? "Hệ thống"} · {formatDateTime(log.created_at)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Chưa có hoạt động.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
