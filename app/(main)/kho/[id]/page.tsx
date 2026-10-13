import Image from "next/image";
import { DeletePhoneButton } from "@/components/delete-phone-button";
import { PageHeader } from "@/components/page-header";
import { SellDialog } from "@/components/sell-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { getPhone } from "@/lib/data";

export default async function PhoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { phone, profile, canEdit } = await getPhone(id);
  const cover = phone.phone_images?.[0]?.public_url;
  const canDelete = profile.role === "ADMIN" || canEdit;

  return (
    <>
      <PageHeader title={phone.name} description={phone.inventory_code} showBack />

      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-5">
          {cover ? (
            <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-panel sm:max-w-md">
              <Image src={cover} alt={phone.name} fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover" priority />
            </div>
          ) : null}

          <div className="overflow-hidden rounded-lg border border-border/90 bg-background/32">
            <DetailRow label="Tên máy" value={phone.name} />
            <DetailRow label="Dòng máy" value={phone.model} />
            <DetailRow label="Tình trạng" value={phone.appearance} />
            <DetailRow label="Dung lượng" value={phone.storage} />
          </div>

          <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
            <SellDialog phone={phone} />
            {canDelete ? <DeletePhoneButton phone={phone} /> : null}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-t border-border/80 px-3 py-3 first:border-t-0 sm:grid-cols-[9rem_1fr] sm:px-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="break-words text-[15px] font-semibold leading-6 text-slate-50">{value}</p>
    </div>
  );
}
