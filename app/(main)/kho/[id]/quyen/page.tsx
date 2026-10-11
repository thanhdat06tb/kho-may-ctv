import { EditPermissionPanel } from "@/components/edit-permission-panel";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getPhoneEditPermissionData } from "@/lib/data";

export default async function PhoneEditPermissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { phone, members, permissions, permissionTableReady } = await getPhoneEditPermissionData(id);

  return (
    <>
      <PageHeader title="Phân quyền sửa" description={`${phone.inventory_code} · ${phone.name}`} showBack backFallbackHref={`/kho/${id}`} />

      <Card>
        <CardContent className="p-4 sm:p-5">
          {permissionTableReady ? (
            <EditPermissionPanel phoneId={phone.id} members={members} permissions={permissions} />
          ) : (
            <p className="text-sm text-slate-400">Chưa tạo bảng phân quyền sửa. Hãy chạy migration Supabase mới nhất rồi thử lại.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
