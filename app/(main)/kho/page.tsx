import Link from "next/link";
import { Filter, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PhoneCard } from "@/components/phone-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { iphoneSeriesFilters, iphoneVariantFilters } from "@/lib/constants";
import { getAvailablePhones, type StockFilters } from "@/lib/data";

const tier1Filters: { value: NonNullable<StockFilters["tier1"]>; label: string }[] = [
  { value: "normal", label: "Bản thường" },
  { value: "qte", label: "Quốc tế / QTE / QT" },
  { value: "lock", label: "Lock" },
  { value: "bypass", label: "Bypass / BP" }
];

export default async function StockPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; tier1?: string; series?: string; variant?: string }>;
}) {
  const { q = "", tier1 = "", series = "", variant = "" } = await searchParams;
  const safeTier1 = tier1Filters.some((item) => item.value === tier1) ? (tier1 as NonNullable<StockFilters["tier1"]>) : undefined;
  const safeSeries = iphoneSeriesFilters.some((item) => item === series) ? series : undefined;
  const safeVariant = iphoneVariantFilters.some((item) => item.value === variant) ? variant : undefined;
  const { phones } = await getAvailablePhones(q.trim(), {
    tier1: safeTier1,
    series: safeSeries,
    variant: safeVariant
  });

  return (
    <>
      <PageHeader
        title="Kho còn hàng"
        description="Tìm và lọc máy theo tên, dòng máy, loại máy."
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
              <Select className="mt-2" name="tier1" defaultValue={safeTier1 ?? ""}>
                <option value="">Tất cả bản máy</option>
                {tier1Filters.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </Select>
              <span className="mt-1 block text-xs font-normal text-slate-500">Dựa theo ký tự trong tên máy.</span>
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
