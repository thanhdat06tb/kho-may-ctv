"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/browser";
import { phoneSchema } from "@/lib/validations";
import type { Phone, PhoneStatus, Profile } from "@/types/domain";

const textFields = [
  ["name", "Tên máy", "iPhone 14 Pro Max"],
  ["model", "Dòng máy", "14 Pro Max"],
  ["appearance", "Tình trạng", "Zin đẹp, màn zin, pin tốt"],
  ["storage", "Dung lượng", "256GB"]
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
      color: phone?.color ?? "Chưa ghi nhận",
      kind: phone?.kind ?? "QUOC_TE",
      carrier: phone?.carrier ?? "",
      battery: phone?.battery ?? 100,
      appearance: phone?.appearance ?? "",
      screen_status: phone?.screen_status ?? "Theo tình trạng chung",
      face_id_status: phone?.face_id_status ?? "Theo tình trạng chung",
      camera_status: phone?.camera_status ?? "Theo tình trạng chung",
      sim_status: phone?.sim_status ?? "Theo tình trạng chung",
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
    const condition = String(values.appearance ?? phone?.appearance ?? "").trim();
    const parsed = phoneSchema.safeParse({
      name: values.name,
      model: values.model,
      storage: values.storage,
      appearance: condition,
      color: initial.color,
      kind: initial.kind,
      carrier: initial.carrier,
      battery: initial.battery,
      screen_status: phone?.screen_status ?? condition,
      face_id_status: phone?.face_id_status ?? condition,
      camera_status: phone?.camera_status ?? condition,
      sim_status: phone?.sim_status ?? condition,
      repair_history: initial.repair_history,
      description: initial.description,
      price: initial.price,
      status: initial.status
    });

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
        <h2 className="text-base font-bold text-slate-50">{phone ? "Cập nhật máy" : "Thêm máy"}</h2>
        <p className="mt-1 text-xs text-slate-400">
          {profile.role === "CTV" ? "Chỉ nhập thông tin cần thiết để lên kho nhanh." : "Admin vẫn có thể chỉnh máy bằng form tối giản này."}
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
          <label className="block text-sm font-semibold text-slate-200 sm:col-span-2">
            Ảnh
            <Input className="mt-2" type="file" accept="image/*" multiple={!phone} required={!phone} onChange={(event) => setFiles(event.target.files)} />
          </label>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" disabled={loading}>
              <Save className="h-5 w-5" />
              {loading ? "Đang lưu..." : "Lưu máy"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
