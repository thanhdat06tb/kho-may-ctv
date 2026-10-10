import Image from "next/image";
import { Camera, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PhoneForm } from "@/components/phone-form";
import { SellDialog } from "@/components/sell-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { phoneKindLabels, phoneStatusLabels, phoneStatusTone } from "@/lib/constants";
import { getPhone } from "@/lib/data";
import { formatDateTime, formatVnd } from "@/lib/format";

export default async function PhoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { phone, profile } = await getPhone(id);
  const canEdit = profile.role === "ADMIN" || (phone.added_by === profile.id && phone.status === "CON_HANG");

  return (
    <AppShell profile={profile}>
      <PageHeader title={phone.name} description={`${phone.inventory_code} · ${phone.model}`} action={<SellDialog phone={phone} />} />
      <div className="grid gap-4 xl:grid-cols-[1fr_26rem]">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
              {phone.phone_images?.length ? (
                phone.phone_images.map((image) => (
                  <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg bg-panel">
                    <Image src={image.public_url} alt={phone.name} fill sizes="260px" className="object-cover" />
                  </div>
                ))
              ) : (
                <div className="col-span-full grid aspect-video place-items-center rounded-lg bg-panel text-slate-500">
                  <Camera className="h-10 w-10" />
                </div>
              )}
            </div>
          </Card>
          {canEdit ? <PhoneForm profile={profile} phone={phone} /> : null}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="font-bold text-slate-50">Thông tin bán</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge tone={phoneStatusTone[phone.status]}>{phoneStatusLabels[phone.status]}</Badge>
                <Badge>{phoneKindLabels[phone.kind]}</Badge>
                {phone.verified_at ? (
                  <Badge tone="mint">
                    <ShieldCheck className="mr-1 h-3 w-3" /> Đã xác minh
                  </Badge>
                ) : null}
              </div>
              <p className="text-3xl font-black text-mint">{formatVnd(phone.price)}</p>
              <Info label="Pin" value={`${phone.battery}%`} />
              <Info label="Dung lượng" value={phone.storage} />
              <Info label="Màu" value={phone.color} />
              <Info label="Nhà mạng" value={phone.carrier ?? "Không có"} />
              <Info label="Người thêm" value={phone.profiles?.full_name ?? "Không rõ"} />
              <Info label="Ngày nhập" value={formatDateTime(phone.created_at)} />
              <Info label="Ngày bán" value={formatDateTime(phone.sold_at)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="font-bold text-slate-50">Tình trạng</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <Info label="Ngoại hình" value={phone.appearance} />
              <Info label="Màn hình" value={phone.screen_status} />
              <Info label="Face ID" value={phone.face_id_status} />
              <Info label="Camera" value={phone.camera_status} />
              <Info label="SIM" value={phone.sim_status} />
              <Info label="Sửa chữa" value={phone.repair_history ?? "Không ghi nhận"} />
              <Info label="Mô tả" value={phone.description ?? "Không có"} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/45 p-3">
      <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm text-slate-100">{value}</p>
    </div>
  );
}
