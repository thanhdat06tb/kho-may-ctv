import Link from "next/link";
import type React from "react";
import { BarChart3, ReceiptText, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getMySalesSummary } from "@/lib/data";
import { formatDateTime, formatVnd } from "@/lib/format";

export default async function StatsPage() {
  const { profile, sales, count, listedTotal, finalTotal, profit } = await getMySalesSummary();

  return (
    <>
      <PageHeader title="Tổng kết của tôi" description={`Tài khoản ${profile.full_name}`} showBack />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Máy đã bán" value={`${count} máy`} icon={<ReceiptText className="h-5 w-5" />} />
        <SummaryCard label="Tổng giá bán ra" value={formatVnd(listedTotal)} icon={<BarChart3 className="h-5 w-5" />} />
        <SummaryCard label="Tổng giá bán thực tế" value={formatVnd(finalTotal)} icon={<BarChart3 className="h-5 w-5" />} />
        <SummaryCard label="Lời / chênh lệch" value={formatVnd(profit)} icon={<TrendingUp className="h-5 w-5" />} tone={profit >= 0 ? "text-mint" : "text-danger"} />
      </div>

      <div className="space-y-3">
        {sales.length ? (
          sales.map((sale) => {
            const listedPrice = Number(sale.phones?.price ?? 0);
            const finalPrice = Number(sale.final_price);
            const diff = finalPrice - listedPrice;

            return (
              <Card key={sale.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/kho/${sale.phone_id}`} className="font-bold text-slate-50 hover:text-mint">
                        {sale.phones?.name ?? "Máy đã bán"}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">{sale.phones?.inventory_code}</p>
                    </div>
                    <p className="shrink-0 text-xs text-slate-400">{formatDateTime(sale.sold_at)}</p>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                    <Info label="Giá bán ra" value={formatVnd(listedPrice)} />
                    <Info label="Giá bán thực tế" value={formatVnd(finalPrice)} />
                    <Info label="Lời / chênh lệch" value={formatVnd(diff)} className={diff >= 0 ? "text-mint" : "text-danger"} />
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-sm text-slate-400">Tài khoản này chưa bán máy nào.</CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

function SummaryCard({ label, value, icon, tone = "text-slate-50" }: { label: string; value: string; icon: React.ReactNode; tone?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-mint/12 text-mint">{icon}</div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className={`mt-1 text-xl font-black ${tone}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function Info({ label, value, className = "text-slate-50" }: { label: string; value: string; className?: string }) {
  return (
    <div className="rounded-lg border border-border/80 bg-background/35 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className={`mt-1 font-black ${className}`}>{value}</p>
    </div>
  );
}
