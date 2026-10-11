"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserCheck, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";
import type { PhoneEditPermission, Profile } from "@/types/domain";

export function EditPermissionPanel({
  phoneId,
  members,
  permissions
}: {
  phoneId: string;
  members: Profile[];
  permissions: PhoneEditPermission[];
}) {
  const router = useRouter();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const grantedUserIds = useMemo(() => new Set(permissions.map((permission) => permission.user_id)), [permissions]);
  const ctvMembers = members.filter((member) => member.role === "CTV" && member.is_active);

  async function grant(userId: string) {
    setLoadingUserId(userId);
    const { error } = await createClient().from("phone_edit_permissions").insert({ phone_id: phoneId, user_id: userId });
    setLoadingUserId(null);

    if (error) {
      toast.error("Không thể cấp quyền sửa", { description: error.message });
      return;
    }

    toast.success("Đã cấp quyền sửa máy");
    router.refresh();
  }

  async function revoke(userId: string) {
    setLoadingUserId(userId);
    const { error } = await createClient().from("phone_edit_permissions").delete().eq("phone_id", phoneId).eq("user_id", userId);
    setLoadingUserId(null);

    if (error) {
      toast.error("Không thể thu quyền sửa", { description: error.message });
      return;
    }

    toast.success("Đã thu quyền sửa máy");
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-border bg-background/45 p-4">
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-mint" />
        <div>
          <h3 className="font-bold text-slate-50">Quyền sửa thông tin</h3>
          <p className="text-xs text-slate-400">Chỉ Admin hoặc CTV được cấp quyền mới sửa được máy này.</p>
        </div>
      </div>
      <div className="space-y-2">
        {ctvMembers.length ? (
          ctvMembers.map((member) => {
            const granted = grantedUserIds.has(member.id);
            return (
              <div key={member.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/70 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100">{member.full_name}</p>
                  <p className="text-xs text-slate-500">{granted ? "Được sửa máy này" : "Chưa được sửa"}</p>
                </div>
                {granted ? (
                  <Button variant="secondary" size="sm" disabled={loadingUserId === member.id} onClick={() => revoke(member.id)}>
                    <UserMinus className="h-4 w-4" />
                    Thu quyền
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" disabled={loadingUserId === member.id} onClick={() => grant(member.id)}>
                    <UserCheck className="h-4 w-4" />
                    Cấp quyền
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-sm text-slate-400">Chưa có CTV đang hoạt động.</p>
        )}
      </div>
    </div>
  );
}
