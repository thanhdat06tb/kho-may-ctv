"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";
import { useOnline } from "@/hooks/use-online";
import type { Phone } from "@/types/domain";

export function ArchivePhoneButton({ phone }: { phone: Phone }) {
  const router = useRouter();
  const online = useOnline();
  const [loading, setLoading] = useState(false);

  async function archivePhone() {
    if (!online) {
      toast.error("Không thể ẩn sản phẩm khi offline");
      return;
    }

    const sure = window.confirm(`Ẩn ${phone.name} khỏi kho còn hàng?`);
    if (!sure) return;

    setLoading(true);
    const { error } = await createClient().rpc("archive_phone", {
      p_phone_id: phone.id
    });
    setLoading(false);

    if (error) {
      toast.error("Không thể ẩn sản phẩm", { description: error.message });
      return;
    }

    toast.success("Đã ẩn sản phẩm khỏi kho");
    router.replace("/kho");
    router.refresh();
  }

  return (
    <Button variant="danger" size="lg" disabled={!online || loading || phone.status === "DA_BAN" || phone.status === "LUU_TRU"} onClick={archivePhone}>
      <Archive className="h-5 w-5" />
      {loading ? "Đang ẩn..." : "Ẩn sản phẩm"}
    </Button>
  );
}
