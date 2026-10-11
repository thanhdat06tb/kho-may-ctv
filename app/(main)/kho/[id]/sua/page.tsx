import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PhoneForm } from "@/components/phone-form";
import { getPhone } from "@/lib/data";

export default async function EditPhonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { phone, profile, canEdit } = await getPhone(id);

  if (!canEdit) {
    redirect(`/kho/${id}`);
  }

  return (
    <>
      <PageHeader title="Sửa thông tin máy" description={`${phone.inventory_code} · ${phone.name}`} showBack backFallbackHref={`/kho/${id}`} />
      <PhoneForm profile={profile} phone={phone} />
    </>
  );
}
