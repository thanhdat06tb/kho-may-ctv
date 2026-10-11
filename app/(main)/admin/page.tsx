import { PageHeader } from "@/components/page-header";
import { ProfileRow, UndoSaleButton } from "@/components/admin-panels";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAdminData } from "@/lib/data";
import { formatDateTime, formatVnd } from "@/lib/format";

export default async function AdminPage() {
  const { profiles, sales, logs } = await getAdminData();

  return (
    <>
      <PageHeader title="Quản trị" description="Quản lý CTV, kiểm tra giao dịch và nhật ký thao tác." showBack />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="font-bold text-slate-50">Tài khoản</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {profiles.map((item) => (
              <ProfileRow key={item.id} profile={item} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-bold text-slate-50">Giao dịch gần đây</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {sales.map((sale) => (
              <div key={sale.id} className="rounded-lg border border-border bg-background/50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-50">{sale.phones?.name ?? "Máy"}</p>
                    <p className="text-xs text-slate-500">{sale.phones?.inventory_code}</p>
                  </div>
                  {sale.voided_at ? <Badge tone="danger">Đã hoàn tác</Badge> : <UndoSaleButton sale={sale} />}
                </div>
                <p className="mt-2 text-sm text-mint font-black">{formatVnd(sale.final_price)}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {sale.profiles?.full_name ?? "Không rõ"} · {formatDateTime(sale.sold_at)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <h2 className="font-bold text-slate-50">Audit log</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-sm font-semibold text-slate-100">{log.action}</p>
              <p className="mt-1 text-xs text-slate-500">
                {log.profiles?.full_name ?? "Hệ thống"} · {formatDateTime(log.created_at)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
