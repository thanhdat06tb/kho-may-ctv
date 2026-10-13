"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/browser";
import { formatVnd } from "@/lib/format";
import { useOnline } from "@/hooks/use-online";
import type { Phone } from "@/types/domain";

export function SellDialog({ phone }: { phone: Phone }) {
  const router = useRouter();
  const online = useOnline();
  const saleable = ["CON_HANG", "DA_GIU"].includes(phone.status);
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(phone.price > 0 ? phone.price : 1);
  const [loading, setLoading] = useState(false);

  async function confirmSale() {
    if (!online) {
      toast.error("Không thể bán khi offline");
      return;
    }
    if (!saleable) {
      toast.error("Máy này không còn ở trạng thái có thể bán");
      return;
    }

    const sure = window.confirm(`Xác nhận đã hoàn tất giao dịch ${phone.inventory_code} với giá ${formatVnd(price)}?`);
    if (!sure) return;

    setLoading(true);
    const { error } = await createClient().rpc("confirm_phone_sale", {
      p_phone_id: phone.id,
      p_final_price: price
    });
    setLoading(false);

    if (error) {
      toast.error("Bán máy thất bại", { description: error.message });
      return;
    }

    toast.success("Đã ghi nhận giao dịch");
    setOpen(false);
    router.replace("/kho");
    router.refresh();
  }

  return (
    <>
      <Button size="lg" disabled={!online || !saleable} onClick={() => saleable && setOpen(true)}>
        <BadgeCheck className="h-5 w-5" />
        {phone.status === "DA_BAN" ? "Đã bán" : "Xác nhận đã bán"}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/60 p-0 sm:place-items-center sm:p-4">
          <Card className="w-full rounded-b-none sm:max-w-md sm:rounded-lg">
            <CardContent className="space-y-4 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-50">Xác nhận bán máy</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {phone.name} · {phone.inventory_code}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background/60 p-3 text-sm">
                <p className="text-slate-400">Giá bán ra</p>
                <p className="mt-1 text-xl font-black text-mint">{formatVnd(phone.price)}</p>
              </div>
              <label className="block text-sm font-semibold text-slate-200">
                Giá bán thực tế
                <Input className="mt-2" type="number" min={1} step={1000} value={price} onChange={(event) => setPrice(Number(event.target.value))} />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" type="button" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <Button type="button" disabled={loading || price <= 0} onClick={confirmSale}>
                  {loading ? "Đang xử lý..." : "Chốt bán"}
                </Button>
              </div>
              <p className="text-xs text-slate-500">Sau khi chốt bán, giao dịch sẽ nằm trong trang Thống kê của tài khoản đang đăng nhập.</p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
