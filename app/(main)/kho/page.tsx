import Link from "next/link";
import { Filter, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PhoneCard } from "@/components/phone-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { iphoneSeriesFilters, iphoneVariantFilters } from "@/lib/constants";
import { getAvailablePhones } from "@/lib/data";
import type { PhoneKind } from "@/types/domain";

const phoneKinds: { value: PhoneKind; label: string }[] = [
  { value: "QUOC_TE", label: "Quốc tế" },
  { value: "LOCK", label: "Lock" },
  { value: "AN", label: "Ẩn" }
];

export default async function StockPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; kind?: string; series?: string; variant?: string }>;
}) {
  const { q = "", kind = "", series = "", variant = "" } = await searchParams;
  const safeKind = phoneKinds.some((item) => item.value === kind) ? (kind as PhoneKind) : undefined;
  const safeSeries = iphoneSeriesFilters.some((item) => item === series) ? series : undefined;
  const safeVariant = iphoneVariantFilters.some((item) => item.value === variant) ? variant : undefined;
  const { phones } = await getAvailablePhones(q.trim(), {
    kind: safeKind,
    series: safeSeries,
    variant: safeVariant
  });

  return (
    <>
      <PageHeader
        title="Kho còn hàng"
        description="Tìm và lọc máy theo từng bậc."
        action={
          <Link href="/kho/them">
            <Button>
              <Plus className="h-5 w-5" /> Thêm máy
            </Button>
          </Link>
        }
      />
      <form className="mb-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-500" />
            <Input name="q" defaultValue={q} className="pl-10" placeholder="Tìm tên, mã kho, dòng máy..." />
          </div>
          <Button type="submit" variant="secondary">Tìm</Button>
        </div>

        <details className="rounded-lg border border-border bg-surface/70">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-bold text-slate-100">
            <Filter className="h-4 w-4 text-mint" />
            Lọc theo bậc
          </summary>
          <div className="grid gap-3 border-t border-border p-4 md:grid-cols-3">
            <label className="text-sm font-semibold text-slate-200">
              Bậc 1
              <Select className="mt-2" name="kind" defaultValue={safeKind ?? ""}>
                <option value="">Tất cả phân loại</option>
                {phoneKinds.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </Select>
            </label>
            <label className="text-sm font-semibold text-slate-200">
              Bậc 2
              <Select className="mt-2" name="series" defaultValue={safeSeries ?? ""}>
                <option value="">Tất cả dòng máy</option>
                {iphoneSeriesFilters.map((item) => (
                  <option key={item} value={item}>iPhone {item}</option>
                ))}
              </Select>
            </label>
            <label className="text-sm font-semibold text-slate-200">
              Bậc 3
              <Select className="mt-2" name="variant" defaultValue={safeVariant ?? ""}>
                <option value="">Tất cả loại máy</option>
                {iphoneVariantFilters.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </Select>
            </label>
            <div className="flex gap-2 md:col-span-3">
              <Button type="submit" variant="secondary">Áp dụng lọc</Button>
              <Link href="/kho">
                <Button type="button" variant="ghost">Xóa lọc</Button>
              </Link>
            </div>
          </div>
        </details>
      </form>
      {phones.length ? (
        <div className="grid gap-3 xl:grid-cols-2">
          {phones.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-sm text-slate-400">Không có máy còn hàng phù hợp.</CardContent>
        </Card>
      )}
    </>
  );
}
