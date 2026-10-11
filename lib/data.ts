import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AuditLog, Phone, Profile, Sale } from "@/types/domain";

type RankingItem = {
  name: string;
  count: number;
  total: number;
  last: string;
};

const stockPhoneSelect = `
  id,
  inventory_code,
  name,
  model,
  storage,
  color,
  kind,
  carrier,
  battery,
  appearance,
  price,
  added_by,
  status,
  created_at,
  updated_at,
  profiles:added_by(full_name),
  phone_images(id, phone_id, public_url, storage_path, sort_order)
`;

const detailPhoneSelect = `
  id,
  inventory_code,
  name,
  model,
  storage,
  color,
  kind,
  carrier,
  battery,
  appearance,
  screen_status,
  face_id_status,
  camera_status,
  sim_status,
  repair_history,
  description,
  price,
  added_by,
  verified_by,
  verified_at,
  status,
  hold_by,
  hold_expires_at,
  sold_at,
  created_at,
  updated_at,
  profiles:added_by(full_name),
  phone_images(id, phone_id, public_url, storage_path, sort_order)
`;

const saleSelect = `
  id,
  phone_id,
  seller_id,
  final_price,
  sold_at,
  voided_at,
  voided_by,
  void_reason,
  phones(name, inventory_code),
  profiles:seller_id(full_name)
`;

const auditSelect = `
  id,
  actor_id,
  action,
  entity_type,
  entity_id,
  details,
  created_at,
  profiles:actor_id(full_name)
`;

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
  const { supabase, profile } = await getRequiredProfile();
  let query = supabase
    .from("phones")
    .select(stockPhoneSelect)
    .eq("status", "CON_HANG")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,inventory_code.ilike.%${search}%,model.ilike.%${search}%`);
  }

  const { data, error } = await query.returns<Phone[]>();
  if (error) throw error;
  return { profile, phones: data ?? [] };
}

export async function getPhone(id: string) {
  const { supabase, profile } = await getRequiredProfile();
  const { data, error } = await supabase
    .from("phones")
    .select(detailPhoneSelect)
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
    supabase.from("sales").select("final_price").is("voided_at", null).limit(1000),
    supabase.from("sales").select("id", { count: "exact", head: true }).is("voided_at", null).gte("sold_at", monthStart.toISOString()),
    supabase.from("audit_logs").select(auditSelect).order("created_at", { ascending: false }).limit(8).returns<AuditLog[]>()
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

function buildRanking(sales: Sale[]): RankingItem[] {
  const ranking = new Map<string, { name: string; count: number; total: number; last: string }>();
  for (const sale of sales) {
    const name = sale.profiles?.full_name ?? "Khong ro";
    const current = ranking.get(sale.seller_id) ?? { name, count: 0, total: 0, last: sale.sold_at };
    current.count += 1;
    current.total += Number(sale.final_price);
    if (new Date(sale.sold_at) > new Date(current.last)) current.last = sale.sold_at;
    ranking.set(sale.seller_id, current);
  }
  return Array.from(ranking.values()).sort((a, b) => b.total - a.total);
}

export async function getSalesHistory(from?: string, to?: string) {
  const { supabase, profile } = await getRequiredProfile();
  let query = supabase
    .from("sales")
    .select(saleSelect)
    .is("voided_at", null)
    .order("sold_at", { ascending: false });

  if (from) query = query.gte("sold_at", from);
  if (to) query = query.lte("sold_at", to);

  const { data, error } = await query.returns<Sale[]>();
  if (error) throw error;

  return { profile, sales: data ?? [] };
}

export async function getRankingOnly(from?: string, to?: string): Promise<{ profile: Profile; ranking: RankingItem[] }> {
  const history = await getSalesHistory(from, to);
  return { profile: history.profile, ranking: buildRanking(history.sales) };
}

export async function getAdminData() {
  const { supabase, profile } = await getRequiredProfile();
  if (profile.role !== "ADMIN") redirect("/dashboard");

  const [profiles, sales, logs] = await Promise.all([
    supabase.from("profiles").select("id, full_name, role, is_active, created_at").order("created_at", { ascending: false }).returns<Profile[]>(),
    supabase.from("sales").select(saleSelect).order("sold_at", { ascending: false }).limit(20).returns<Sale[]>(),
    supabase.from("audit_logs").select(auditSelect).order("created_at", { ascending: false }).limit(30).returns<AuditLog[]>()
  ]);

  if (profiles.error) throw profiles.error;
  if (sales.error) throw sales.error;
  if (logs.error) throw logs.error;

  return { profile, profiles: profiles.data ?? [], sales: sales.data ?? [], logs: logs.data ?? [] };
}
