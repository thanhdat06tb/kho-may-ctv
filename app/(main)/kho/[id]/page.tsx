import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { Battery, Camera, Cpu, Edit3, HardDrive, Monitor, Palette, ShieldCheck, Signal, Smartphone } from "lucide-react";
import { EditPermissionPanel } from "@/components/edit-permission-panel";
import { PageHeader } from "@/components/page-header";
import { SellDialog } from "@/components/sell-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { phoneKindLabels, phoneStatusLabels, phoneStatusTone } from "@/lib/constants";
import { getPhone } from "@/lib/data";
import { formatDateTime, formatVnd } from "@/lib/format";

export default async function PhoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { phone, profile, canEdit, members, permissionTableReady } = await getPhone(id);
  const cover = phone.phone_images?.[0]?.public_url;

  return (
    <>
      <PageHeader title={phone.name} description={`${phone.inventory_code} · ${phone.model}`} showBack />

      <Card className="overflow-hidden">
        <CardContent className="space-y-5 p-4 sm:p-5">
          <div className="grid gap-4 xl:grid-cols-[22rem_1fr]">
            <div className="space-y-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-panel">
                {cover ? (
                  <Image src={cover} alt={phone.name} fill sizes="360px" priority className="object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-slate-500">
                    <Camera className="h-10 w-10" />
                  </div>
                )}
              </div>
              {phone.phone_images && phone.phone_images.length > 1 ? (
                <div className="grid grid-cols-4 gap-2">
                  {phone.phone_images.slice(1, 5).map((image) => (
                    <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg bg-panel">
                      <Image src={image.public_url} alt={phone.name} fill sizes="90px" className="object-cover" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge tone={phoneStatusTone[phone.status]}>{phoneStatusLabels[phone.status]}</Badge>
                <Badge>{phoneKindLabels[phone.kind]}</Badge>
                {phone.verified_at ? (
                  <Badge tone="mint">
                    <ShieldCheck className="mr-1 h-3 w-3" /> Đã xác minh
                  </Badge>
                ) : null}
              </div>

              <div className="mt-4 rounded-lg border border-mint/25 bg-mint/10 p-4">
                <p className="text-xs font-semibold uppercase text-mint/80">Giá bán</p>
                <p className="mt-1 text-3xl font-black text-mint sm:text-4xl">{formatVnd(phone.price)}</p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <SummaryItem icon={Smartphone} label="Dòng máy" value={phone.model} important />
                <SummaryItem icon={HardDrive} label="Dung lượng" value={phone.storage} important />
                <SummaryItem icon={Battery} label="Pin" value={`${phone.battery}%`} important />
                <SummaryItem icon={Monitor} label="Màn hình" value={phone.screen_status} important />
                <SummaryItem icon={Cpu} label="Tình trạng" value={phone.appearance} important />
                <SummaryItem icon={Palette} label="Màu sắc" value={phone.color} />
                <SummaryItem icon={Signal} label="SIM" value={phone.sim_status} />
                <SummaryItem icon={Camera} label="Camera" value={phone.camera_status} />
                <SummaryItem icon={ShieldCheck} label="Face ID" value={phone.face_id_status} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Info label="Mã kho" value={phone.inventory_code} />
                <Info label="Nhà mạng" value={phone.carrier ?? "Không có"} />
                <Info label="Người thêm" value={phone.profiles?.full_name ?? "Không rõ"} />
                <Info label="Ngày nhập" value={formatDateTime(phone.created_at)} />
                <Info label="Ngày bán" value={formatDateTime(phone.sold_at)} />
                <Info label="Cập nhật" value={formatDateTime(phone.updated_at)} />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-lg border border-border bg-background/45 p-3 xl:col-span-1">
              <p className="text-xs font-semibold uppercase text-slate-500">Sửa chữa / thay thế</p>
              <p className="mt-1 break-words text-sm text-slate-100">{phone.repair_history ?? "Không ghi nhận"}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/45 p-3 xl:col-span-2">
              <p className="text-xs font-semibold uppercase text-slate-500">Mô tả chi tiết</p>
              <p className="mt-1 break-words text-sm text-slate-100">{phone.description ?? "Không có"}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
            <SellDialog phone={phone} />
            {canEdit ? (
              <Link href={`/kho/${phone.id}/sua`}>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Edit3 className="h-5 w-5" />
                  Sửa thông tin
                </Button>
              </Link>
            ) : null}
          </div>

          {profile.role === "ADMIN" && permissionTableReady ? (
            <EditPermissionPanel phoneId={phone.id} members={members} permissions={phone.phone_edit_permissions ?? []} />
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
  important = false
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  important?: boolean;
}) {
  return (
    <div className={important ? "rounded-lg border border-mint/25 bg-mint/10 p-3" : "rounded-lg border border-border bg-background/45 p-3"}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
        <Icon className={important ? "h-4 w-4 text-mint" : "h-4 w-4 text-slate-500"} />
        {label}
      </div>
      <p className="mt-2 break-words text-base font-bold text-slate-50">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/45 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm text-slate-100">{value}</p>
    </div>
  );
}
