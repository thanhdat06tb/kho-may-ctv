import Image from "next/image";
import Link from "next/link";
import { Edit3, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SellDialog } from "@/components/sell-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPhone } from "@/lib/data";

export default async function PhoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { phone, profile, canEdit } = await getPhone(id);
  const cover = phone.phone_images?.[0]?.public_url;

  return (
    <>
      <PageHeader title={phone.name} description={phone.inventory_code} showBack />

      <Card>
        <CardContent className="p-4 sm:p-5">
          {cover ? (
            <div className="relative mb-4 aspect-[4/3] max-w-md overflow-hidden rounded-lg border border-border bg-panel">
              <Image src={cover} alt={phone.name} fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover" />
            </div>
          ) : null}

          <div className="overflow-hidden rounded-lg border border-border">
            <DetailRow label="Tên máy" value={phone.name} />
            <DetailRow label="Dòng máy" value={phone.model} />
            <DetailRow label="Tình trạng" value={phone.appearance} />
            <DetailRow label="Dung lượng" value={phone.storage} />
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <SellDialog phone={phone} />
            {canEdit ? (
              <Link href={`/kho/${phone.id}/sua`}>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Edit3 className="h-5 w-5" />
                  Sửa thông tin
                </Button>
              </Link>
            ) : null}
            {profile.role === "ADMIN" ? (
              <Link href={`/kho/${phone.id}/quyen`}>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <ShieldCheck className="h-5 w-5" />
                  Phân quyền sửa
                </Button>
              </Link>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-t border-border px-4 py-3 first:border-t-0 sm:grid-cols-[9rem_1fr]">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="break-words text-sm font-semibold text-slate-50">{value}</p>
    </div>
  );
}
