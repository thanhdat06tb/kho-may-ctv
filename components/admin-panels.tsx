"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/browser";
import type { Profile, Sale } from "@/types/domain";

export function ProfileRow({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [role, setRole] = useState(profile.role);
  const [active, setActive] = useState(profile.is_active);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    const { error } = await createClient().from("profiles").update({ role, is_active: active }).eq("id", profile.id);
    setLoading(false);
    if (error) {
      toast.error("Không thể cập nhật tài khoản", { description: error.message });
      return;
    }
    toast.success("Đã cập nhật tài khoản");
    router.refresh();
  }

  return (
    <div className="grid gap-3 rounded-lg border border-border bg-background/50 p-3 sm:grid-cols-[1fr_8rem_8rem_auto] sm:items-center">
      <div>
        <p className="font-semibold text-slate-100">{profile.full_name}</p>
        <p className="text-xs text-slate-500">{profile.id}</p>
      </div>
      <Select value={role} onChange={(event) => setRole(event.target.value as Profile["role"])}>
        <option value="CTV">CTV</option>
        <option value="ADMIN">ADMIN</option>
      </Select>
      <Select value={active ? "1" : "0"} onChange={(event) => setActive(event.target.value === "1")}>
        <option value="1">Hoạt động</option>
        <option value="0">Vô hiệu</option>
      </Select>
      <Button variant="secondary" onClick={save} disabled={loading}>
        <Save className="h-4 w-4" /> Lưu
      </Button>
    </div>
  );
}

export function UndoSaleButton({ sale }: { sale: Sale }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function undo() {
    const reason = window.prompt(`Nhập lý do hoàn tác giao dịch ${sale.phones?.inventory_code ?? sale.id}`);
    if (!reason?.trim()) return;
    setLoading(true);
    const { error } = await createClient().rpc("undo_sale", {
      p_sale_id: sale.id,
      p_reason: reason.trim()
    });
    setLoading(false);
    if (error) {
      toast.error("Không thể hoàn tác", { description: error.message });
      return;
    }
    toast.success("Đã hoàn tác giao dịch");
    router.refresh();
  }

  if (sale.voided_at) return <span className="text-xs text-slate-500">Đã hoàn tác</span>;

  return (
    <Button variant="secondary" size="sm" onClick={undo} disabled={loading}>
      <RotateCcw className="h-4 w-4" />
      Hoàn tác
    </Button>
  );
}
