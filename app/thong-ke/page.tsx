import { Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getRankingOnly } from "@/lib/data";
import { formatDateTime, formatVnd } from "@/lib/format";

export default async function StatsPage() {
  const { profile, ranking } = await getRankingOnly();

  return (
    <AppShell profile={profile}>
      <PageHeader title="Bảng xếp hạng" description="Chỉ tính giao dịch hợp lệ, tự loại giao dịch đã hoàn tác." />
      <div className="space-y-3">
        {ranking.length ? (
          ranking.map((row, index) => (
            <Card key={row.name}>
              <CardContent className="grid grid-cols-[3rem_1fr] gap-3 p-4 sm:grid-cols-[3rem_1fr_9rem_11rem] sm:items-center">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-mint/12 text-lg font-black text-mint">
                  {index === 0 ? <Trophy className="h-5 w-5" /> : index + 1}
                </div>
                <div>
                  <p className="font-bold text-slate-50">{row.name}</p>
                  <p className="text-sm text-slate-400">{row.count} máy đã bán</p>
                </div>
                <p className="font-black text-mint">{formatVnd(row.total)}</p>
                <p className="text-sm text-slate-400">{formatDateTime(row.last)}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-sm text-slate-400">Chưa có giao dịch hợp lệ.</CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
