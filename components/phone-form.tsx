"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/browser";
import { phoneSchema } from "@/lib/validations";
import type { Phone, PhoneStatus, Profile } from "@/types/domain";

const textFields = [
  ["name", "Tên điện thoại", "iPhone 14 Pro Max"],
  ["model", "Dòng máy", "14 Pro Max"],
  ["storage", "Dung lượng", "256GB"],
  ["color", "Màu sắc", "Deep Purple"],
  ["appearance", "Ngoại hình", "Đẹp 98%"],
  ["screen_status", "Màn hình", "Zin, hiển thị đẹp"],
  ["face_id_status", "Face ID", "Hoạt động tốt"],
  ["camera_status", "Camera", "Hoạt động tốt"],
  ["sim_status", "SIM", "Nhận SIM ổn định"]
] as const;

export function PhoneForm({ profile, phone }: { profile: Profile; phone?: Phone }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const initial = useMemo(
    () => ({
      name: phone?.name ?? "",
      model: phone?.model ?? "",
      storage: phone?.storage ?? "",
      color: phone?.color ?? "",
      kind: phone?.kind ?? "QUOC_TE",
      carrier: phone?.carrier ?? "",
      battery: phone?.battery ?? 90,
      appearance: phone?.appearance ?? "",
      screen_status: phone?.screen_status ?? "",
      face_id_status: phone?.face_id_status ?? "",
      camera_status: phone?.camera_status ?? "",
      sim_status: phone?.sim_status ?? "",
      repair_history: phone?.repair_history ?? "",
      description: phone?.description ?? "",
      price: phone?.price ?? 0,
      status: phone?.status ?? "CON_HANG"
    }),
    [phone]
  );

  async function uploadImages(phoneId: string) {
    if (!files?.length) return;
    const supabase = createClient();
    const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET ?? "phone-images";
    const rows = [];

    for (const [index, file] of Array.from(files).entries()) {
      if (!file.type.startsWith("image/")) throw new Error(`${file.name} không phải ảnh`);
      if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} vượt quá 5MB`);

      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${phoneId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false
      });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      rows.push({ phone_id: phoneId, storage_path: path, public_url: data.publicUrl, sort_order: index });
    }

    const { error } = await supabase.from("phone_images").insert(rows);
    if (error) throw error;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());
    const parsed = phoneSchema.safeParse(values);

    if (!parsed.success) {
      setLoading(false);
      toast.error("Thông tin chưa hợp lệ", { description: parsed.error.issues[0]?.message });
      return;
    }

    const payload = {
      ...parsed.data,
      carrier: parsed.data.kind === "LOCK" ? parsed.data.carrier || null : null,
      repair_history: parsed.data.repair_history || null,
      description: parsed.data.description || null,
      status: parsed.data.kind === "AN" && !phone?.verified_at ? ("CHO_XAC_MINH" as PhoneStatus) : parsed.data.status
    };

    try {
      const supabase = createClient();
      if (phone) {
        const { error } = await supabase.from("phones").update(payload).eq("id", phone.id);
        if (error) throw error;
        await uploadImages(phone.id);
        toast.success("Đã cập nhật máy");
        router.refresh();
      } else {
        const { data, error } = await supabase.from("phones").insert(payload).select("id").single<{ id: string }>();
        if (error) throw error;
        await uploadImages(data.id);
        toast.success("Đã thêm máy vào kho");
        router.replace(`/kho/${data.id}`);
      }
    } catch (error) {
      toast.error("Không thể lưu máy", { description: error instanceof Error ? error.message : "Vui lòng thử lại" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-bold text-slate-50">{phone ? "Cập nhật thông tin máy" : "Thêm điện thoại"}</h2>
        <p className="mt-1 text-xs text-slate-400">
          {profile.role === "CTV" ? "CTV chỉ sửa được máy mình thêm khi máy còn hàng." : "Admin có quyền chỉnh toàn bộ máy."}
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          {textFields.map(([name, label, placeholder]) => (
            <label key={name} className="block text-sm font-semibold text-slate-200">
              {label}
              <Input className="mt-2" name={name} defaultValue={String(initial[name])} placeholder={placeholder} required />
            </label>
          ))}
          <label className="block text-sm font-semibold text-slate-200">
            Phân loại
            <Select className="mt-2" name="kind" defaultValue={initial.kind}>
              <option value="QUOC_TE">Quốc tế</option>
              <option value="LOCK">Lock</option>
              <option value="AN">Ẩn / cần xác minh</option>
            </Select>
          </label>
          <label className="block text-sm font-semibold text-slate-200">
            Nhà mạng khóa
            <Input className="mt-2" name="carrier" defaultValue={initial.carrier ?? ""} placeholder="Chỉ nhập nếu máy Lock" />
          </label>
          <label className="block text-sm font-semibold text-slate-200">
            Pin (%)
            <Input className="mt-2" name="battery" type="number" min={0} max={100} defaultValue={initial.battery} required />
          </label>
          <label className="block text-sm font-semibold text-slate-200">
            Giá bán
            <Input className="mt-2" name="price" type="number" min={0} step={1000} defaultValue={initial.price} required />
          </label>
          <label className="block text-sm font-semibold text-slate-200">
            Trạng thái
            <Select className="mt-2" name="status" defaultValue={initial.status}>
              <option value="CON_HANG">Còn hàng</option>
              <option value="CHO_XAC_MINH">Chờ xác minh</option>
              <option value="DA_GIU">Đã giữ</option>
              <option value="LUU_TRU">Lưu trữ</option>
            </Select>
          </label>
          <label className="block text-sm font-semibold text-slate-200">
            Ảnh sản phẩm
            <Input className="mt-2" type="file" accept="image/*" multiple onChange={(event) => setFiles(event.target.files)} />
          </label>
          <label className="block text-sm font-semibold text-slate-200 sm:col-span-2">
            Lịch sử sửa chữa / thay thế
            <Textarea className="mt-2" name="repair_history" defaultValue={initial.repair_history ?? ""} />
          </label>
          <label className="block text-sm font-semibold text-slate-200 sm:col-span-2">
            Mô tả tình trạng chi tiết
            <Textarea className="mt-2" name="description" defaultValue={initial.description ?? ""} />
          </label>
          <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
            <Button type="submit" size="lg" disabled={loading}>
              <Save className="h-5 w-5" />
              {loading ? "Đang lưu..." : "Lưu máy"}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}>
              <ImagePlus className="h-5 w-5" />
              Chọn ảnh
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
