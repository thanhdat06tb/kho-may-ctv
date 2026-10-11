import Link from "next/link";
import { Edit3, ShieldCheck } from "lucide-react";
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
  const { phone, profile, canEdit } = await getPhone(id);

  return (
    <>
      <PageHeader title={phone.name} description={`${phone.inventory_code} · ${phone.model}`} showBack />

      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={phoneStatusTone[phone.status]}>{phoneStatusLabels[phone.status]}</Badge>
            <Badge>{phoneKindLabels[phone.kind]}</Badge>
            {phone.verified_at ? (
              <Badge tone="mint">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Đã xác minh
              </Badge>
            ) : null}
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <DetailRow label="Giá bán" value={formatVnd(phone.price)} highlight />
            <DetailRow label="Dòng máy" value={phone.model} />
            <DetailRow label="Dung lượng" value={phone.storage} />
            <DetailRow label="Pin" value={`${phone.battery}%`} />
            <DetailRow label="Màn hình" value={phone.screen_status} />
            <DetailRow label="Tình trạng" value={phone.appearance} />
            <DetailRow label="Màu sắc" value={phone.color} />
            <DetailRow label="SIM" value={phone.sim_status} />
            <DetailRow label="Camera" value={phone.camera_status} />
            <DetailRow label="Face ID" value={phone.face_id_status} />
            <DetailRow label="Nhà mạng" value={phone.carrier ?? "Không có"} />
            <DetailRow label="Mã kho" value={phone.inventory_code} />
            <DetailRow label="Người thêm" value={phone.profiles?.full_name ?? "Không rõ"} />
            <DetailRow label="Ngày nhập" value={formatDateTime(phone.created_at)} />
            <DetailRow label="Ngày bán" value={formatDateTime(phone.sold_at)} />
            <DetailRow label="Cập nhật" value={formatDateTime(phone.updated_at)} />
            <DetailRow label="Sửa chữa / thay thế" value={phone.repair_history ?? "Không ghi nhận"} />
            <DetailRow label="Mô tả chi tiết" value={phone.description ?? "Không có"} />
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

function DetailRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={highlight ? "grid gap-1 bg-mint/10 px-4 py-3 sm:grid-cols-[13rem_1fr]" : "grid gap-1 border-t border-border px-4 py-3 sm:grid-cols-[13rem_1fr]"}>
      <p className={highlight ? "text-xs font-bold uppercase text-mint/80" : "text-xs font-semibold uppercase text-slate-500"}>{label}</p>
      <p className={highlight ? "break-words text-2xl font-black text-mint sm:text-3xl" : "break-words text-sm font-semibold text-slate-50"}>{value}</p>
    </div>
  );
}
