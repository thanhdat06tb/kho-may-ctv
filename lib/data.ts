import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AuditLog, Phone, Profile, Sale } from "@/types/domain";

export async function getRequiredProfile() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active, created_at")
    .eq("id", user.id)
    .single<Profile>();

  if (error || !profile || !profile.is_active) {
    redirect("/login?error=inactive");
  }

  return { supabase, profile };
}

export async function getAvailablePhones(search?: string) {
  const { supabase } = await getRequiredProfile();
  let query = supabase
    .from("phones")
    .select("*, profiles:added_by(full_name), phone_images(*)")
    .eq("status", "CON_HANG")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,inventory_code.ilike.%${search}%,model.ilike.%${search}%`);
  }

  const { data, error } = await query.returns<Phone[]>();
  if (error) throw error;
  return data ?? [];
}

export async function getPhone(id: string) {
  const { supabase, profile } = await getRequiredProfile();
  const { data, error } = await supabase
    .from("phones")
    .select("*, profiles:added_by(full_name), phone_images(*)")
    .eq("id", id)
    .single<Phone>();
  if (error) throw error;
  return { phone: data, profile };
}

export async function getDashboardStats() {
  const { supabase, profile } = await getRequiredProfile();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [available, sold, salesTotal, monthSales, logs] = await Promise.all([
    supabase.from("phones").select("id", { count: "exact", head: true }).eq("status", "CON_HANG"),
    supabase.from("phones").select("id", { count: "exact", head: true }).eq("status", "DA_BAN"),
    supabase.from("sales").select("final_price").is("voided_at", null),
    supabase.from("sales").select("id", { count: "exact", head: true }).is("voided_at", null).gte("sold_at", monthStart.toISOString()),
    supabase.from("audit_logs").select("*, profiles:actor_id(full_name)").order("created_at", { ascending: false }).limit(8).returns<AuditLog[]>()
  ]);

  return {
    profile,
    availableCount: available.count ?? 0,
    soldCount: sold.count ?? 0,
    totalRevenue: salesTotal.data?.reduce((sum, row) => sum + Number(row.final_price), 0) ?? 0,
    monthSalesCount: monthSales.count ?? 0,
    logs: logs.data ?? []
  };
}

export async function getSalesAndRanking(from?: string, to?: string) {
  const { supabase, profile } = await getRequiredProfile();
  let query = supabase
    .from("sales")
    .select("*, phones(name, inventory_code), profiles:seller_id(full_name)")
    .is("voided_at", null)
    .order("sold_at", { ascending: false });

  if (from) query = query.gte("sold_at", from);
  if (to) query = query.lte("sold_at", to);

  const { data, error } = await query.returns<Sale[]>();
  if (error) throw error;

  const ranking = new Map<string, { name: string; count: number; total: number; last: string }>();
  for (const sale of data ?? []) {
    const name = sale.profiles?.full_name ?? "Không rõ";
    const current = ranking.get(sale.seller_id) ?? { name, count: 0, total: 0, last: sale.sold_at };
    current.count += 1;
    current.total += Number(sale.final_price);
    if (new Date(sale.sold_at) > new Date(current.last)) current.last = sale.sold_at;
    ranking.set(sale.seller_id, current);
  }

  return { profile, sales: data ?? [], ranking: Array.from(ranking.values()).sort((a, b) => b.total - a.total) };
}

export async function getAdminData() {
  const { supabase, profile } = await getRequiredProfile();
  if (profile.role !== "ADMIN") redirect("/dashboard");

  const [profiles, sales, logs] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).returns<Profile[]>(),
    supabase.from("sales").select("*, phones(name, inventory_code), profiles:seller_id(full_name)").order("sold_at", { ascending: false }).limit(20).returns<Sale[]>(),
    supabase.from("audit_logs").select("*, profiles:actor_id(full_name)").order("created_at", { ascending: false }).limit(30).returns<AuditLog[]>()
  ]);

  if (profiles.error) throw profiles.error;
  if (sales.error) throw sales.error;
  if (logs.error) throw logs.error;

  return { profile, profiles: profiles.data ?? [], sales: sales.data ?? [], logs: logs.data ?? [] };
}
