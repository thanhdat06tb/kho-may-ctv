import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PhoneForm } from "@/components/phone-form";
import { getRequiredProfile } from "@/lib/data";

export default async function AddPhonePage() {
  const { profile } = await getRequiredProfile();

  return (
    <AppShell profile={profile}>
      <PageHeader title="Thêm máy" description="Máy nhóm Ẩn sẽ tự chuyển sang chờ xác minh trước khi được bán." />
      <PhoneForm profile={profile} />
    </AppShell>
  );
}
