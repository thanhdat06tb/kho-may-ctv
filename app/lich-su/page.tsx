import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSalesAndRanking } from "@/lib/data";
import { formatDateTime, formatVnd } from "@/lib/format";

export default async function HistoryPage() {
  const { profile, sales } = await getSalesAndRanking();

  return (
    <AppShell profile={profile}>
      <PageHeader title="Lịch sử bán" description="Giao dịch đã hoàn tác không xuất hiện ở danh sách này." />
      <div className="space-y-3">
        {sales.length ? (
          sales.map((sale) => (
            <Card key={sale.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/kho/${sale.phone_id}`} className="font-bold text-slate-50 hover:text-mint">
                      {sale.phones?.name ?? "Máy đã bán"}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">{sale.phones?.inventory_code}</p>
                  </div>
                  <Badge tone="mint">Hợp lệ</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                  <p className="text-mint font-black">{formatVnd(sale.final_price)}</p>
                  <p className="text-slate-300">{sale.profiles?.full_name ?? "Không rõ"}</p>
                  <p className="text-slate-400">{formatDateTime(sale.sold_at)}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-sm text-slate-400">Chưa có giao dịch.</CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
