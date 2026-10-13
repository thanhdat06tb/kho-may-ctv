"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";
import { useOnline } from "@/hooks/use-online";
import type { Phone } from "@/types/domain";

export function DeletePhoneButton({ phone }: { phone: Phone }) {
  const router = useRouter();
  const online = useOnline();
  const [loading, setLoading] = useState(false);

  async function deletePhone() {
    if (!online) {
      toast.error("Không thể xóa máy khi offline");
      return;
    }

    const typed = window.prompt(`Xóa vĩnh viễn ${phone.name}? Nhập XOA để xác nhận.`);
    if (typed !== "XOA") return;

    setLoading(true);
    const { error } = await createClient().rpc("delete_phone", {
      p_phone_id: phone.id
    });
    setLoading(false);

    if (error) {
      toast.error("Không thể xóa máy", { description: error.message });
      return;
    }

    toast.success("Đã xóa máy khỏi kho");
    router.replace("/kho");
    router.refresh();
  }

  return (
    <Button variant="danger" size="lg" disabled={!online || loading || phone.status === "DA_BAN"} onClick={deletePhone}>
      <Trash2 className="h-5 w-5" />
      {loading ? "Đang xóa..." : "Xóa máy"}
    </Button>
  );
}
