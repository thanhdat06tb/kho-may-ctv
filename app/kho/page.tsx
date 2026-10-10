import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PhoneCard } from "@/components/phone-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAvailablePhones } from "@/lib/data";

export default async function StockPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const { profile, phones } = await getAvailablePhones(q.trim());

  return (
    <AppShell profile={profile}>
      <PageHeader
        title="Kho còn hàng"
        description="Chỉ hiển thị máy trạng thái còn hàng."
        action={
          <Link href="/kho/them">
            <Button>
              <Plus className="h-5 w-5" /> Thêm máy
            </Button>
          </Link>
        }
      />
      <form className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-500" />
          <Input name="q" defaultValue={q} className="pl-10" placeholder="Tìm tên, mã kho, dòng máy..." />
        </div>
        <Button type="submit" variant="secondary">Tìm</Button>
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
    </AppShell>
  );
}
