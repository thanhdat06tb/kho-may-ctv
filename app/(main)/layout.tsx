import { AppShell } from "@/components/app-shell";
import { getRequiredProfile } from "@/lib/data";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getRequiredProfile();
  return <AppShell profile={profile}>{children}</AppShell>;
}
