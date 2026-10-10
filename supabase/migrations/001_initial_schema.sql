create extension if not exists pgcrypto;

create type public.user_role as enum ('ADMIN', 'CTV');
create type public.phone_kind as enum ('LOCK', 'QUOC_TE', 'AN');
create type public.phone_status as enum ('CHO_XAC_MINH', 'CON_HANG', 'DA_GIU', 'DA_BAN', 'LUU_TRU');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  role public.user_role not null default 'CTV',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.phones (
  id uuid primary key default gen_random_uuid(),
  inventory_code text not null unique,
  name text not null check (char_length(name) between 2 and 120),
  model text not null,
  storage text not null,
  color text not null,
  kind public.phone_kind not null,
  carrier text,
  battery integer not null check (battery between 0 and 100),
  appearance text not null,
  screen_status text not null,
  face_id_status text not null,
  camera_status text not null,
  sim_status text not null,
  repair_history text,
  description text,
  price numeric(14, 0) not null check (price >= 0),
  added_by uuid not null default auth.uid() references public.profiles(id),
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  status public.phone_status not null default 'CON_HANG',
  hold_by uuid references public.profiles(id),
  hold_expires_at timestamptz,
  sold_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lock_requires_carrier check (kind <> 'LOCK' or nullif(carrier, '') is not null),
  constraint sold_requires_sold_at check (status <> 'DA_BAN' or sold_at is not null),
  constraint an_requires_verification_for_sale check (
    kind <> 'AN'
    or status in ('CHO_XAC_MINH', 'LUU_TRU')
    or verified_at is not null
  )
);

create table public.phone_images (
  id uuid primary key default gen_random_uuid(),
  phone_id uuid not null references public.phones(id) on delete cascade,
  storage_path text not null unique,
  public_url text not null,
  sort_order integer not null default 0,
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  phone_id uuid not null references public.phones(id),
  seller_id uuid not null references public.profiles(id),
  final_price numeric(14, 0) not null check (final_price > 0),
  sold_at timestamptz not null default now(),
  voided_at timestamptz,
  voided_by uuid references public.profiles(id),
  void_reason text,
  created_at timestamptz not null default now(),
  constraint void_requires_reason check (voided_at is null or nullif(void_reason, '') is not null)
);

create unique index sales_one_active_per_phone_idx on public.sales(phone_id) where voided_at is null;

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index phones_status_created_idx on public.phones(status, created_at desc);
create index phones_added_by_idx on public.phones(added_by);
create index phones_search_idx on public.phones using gin (
  to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(inventory_code, '') || ' ' || coalesce(model, ''))
);
create index phone_images_phone_id_idx on public.phone_images(phone_id, sort_order);
create index sales_seller_sold_idx on public.sales(seller_id, sold_at desc) where voided_at is null;
create index audit_logs_created_idx on public.audit_logs(created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger phones_touch_updated_at
before update on public.phones
for each row execute function public.touch_updated_at();

create or replace function public.generate_inventory_code()
returns trigger
language plpgsql
as $$
begin
  if new.inventory_code is null or new.inventory_code = '' then
    new.inventory_code := 'KM-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
  end if;
  return new;
end;
$$;

create trigger phones_generate_inventory_code
before insert on public.phones
for each row execute function public.generate_inventory_code();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'CTV mới'),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'CTV')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.my_role()
returns public.user_role
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and is_active = true;
$$;

create or replace function public.is_active_user()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and is_active = true);
$$;

create or replace function public.log_audit(
  p_actor_id uuid,
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_details jsonb default '{}'::jsonb
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, details)
  values (p_actor_id, p_action, p_entity_type, p_entity_id, coalesce(p_details, '{}'::jsonb));
$$;

create or replace function public.guard_phone_status_update()
returns trigger
language plpgsql
as $$
begin
  if old.status is distinct from new.status and new.status = 'DA_BAN' then
    if coalesce(current_setting('app.allow_sale_update', true), '') <> 'on' then
      raise exception 'Chỉ được chuyển sang DA_BAN qua RPC confirm_phone_sale';
    end if;
  end if;

  if old.status = 'DA_BAN' and old.status is distinct from new.status then
    if coalesce(current_setting('app.allow_sale_update', true), '') <> 'on' then
      raise exception 'Chỉ Admin được hoàn tác bán hàng qua RPC undo_sale';
    end if;
  end if;

  if new.kind = 'AN' and new.status in ('CON_HANG', 'DA_GIU', 'DA_BAN') and new.verified_at is null then
    raise exception 'Máy nhóm AN phải được xác minh trước khi mở bán hoặc bán';
  end if;

  return new;
end;
$$;

create trigger phones_guard_status_update
before update on public.phones
for each row execute function public.guard_phone_status_update();

alter table public.profiles enable row level security;
alter table public.phones enable row level security;
alter table public.phone_images enable row level security;
alter table public.sales enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_select_active_self_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.my_role() = 'ADMIN');

create policy "profiles_admin_update"
on public.profiles for update
to authenticated
using (public.my_role() = 'ADMIN')
with check (public.my_role() = 'ADMIN');

create policy "phones_select_active"
on public.phones for select
to authenticated
using (public.is_active_user());

create policy "phones_insert_active"
on public.phones for insert
to authenticated
with check (
  public.is_active_user()
  and added_by = auth.uid()
  and status <> 'DA_BAN'
  and (kind <> 'AN' or status = 'CHO_XAC_MINH')
);

create policy "phones_update_admin_or_owner_available"
on public.phones for update
to authenticated
using (
  public.my_role() = 'ADMIN'
  or (added_by = auth.uid() and status in ('CON_HANG', 'CHO_XAC_MINH', 'DA_GIU'))
)
with check (
  public.my_role() = 'ADMIN'
  or (added_by = auth.uid() and status in ('CON_HANG', 'CHO_XAC_MINH', 'DA_GIU'))
);

create policy "phone_images_select_active"
on public.phone_images for select
to authenticated
using (public.is_active_user());

create policy "phone_images_insert_active"
on public.phone_images for insert
to authenticated
with check (public.is_active_user() and created_by = auth.uid());

create policy "sales_select_active"
on public.sales for select
to authenticated
using (public.is_active_user());

create policy "audit_select_admin"
on public.audit_logs for select
to authenticated
using (public.my_role() = 'ADMIN');

create or replace function public.confirm_phone_sale(p_phone_id uuid, p_final_price numeric)
returns public.sales
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_role public.user_role;
  v_phone public.phones%rowtype;
  v_sale public.sales%rowtype;
begin
  if v_user is null then
    raise exception 'Chưa đăng nhập';
  end if;

  select role into v_role from public.profiles where id = v_user and is_active = true;
  if v_role is null then
    raise exception 'Tài khoản không hoạt động';
  end if;

  if p_final_price is null or p_final_price <= 0 then
    raise exception 'Giá chốt không hợp lệ';
  end if;

  select * into v_phone from public.phones where id = p_phone_id for update;
  if not found then
    raise exception 'Không tìm thấy máy';
  end if;

  if v_phone.status not in ('CON_HANG', 'DA_GIU') then
    raise exception 'Máy không ở trạng thái có thể bán';
  end if;

  if v_phone.status = 'DA_GIU' and (v_phone.hold_by is distinct from v_user or v_phone.hold_expires_at < now()) then
    raise exception 'Máy đang được giữ không hợp lệ cho tài khoản này';
  end if;

  if v_phone.kind = 'AN' and v_phone.verified_at is null then
    raise exception 'Máy nhóm AN chưa được xác minh';
  end if;

  perform set_config('app.allow_sale_update', 'on', true);

  update public.phones
  set status = 'DA_BAN',
      sold_at = now(),
      hold_by = null,
      hold_expires_at = null
  where id = p_phone_id;

  insert into public.sales(phone_id, seller_id, final_price)
  values (p_phone_id, v_user, p_final_price)
  returning * into v_sale;

  perform public.log_audit(
    v_user,
    'CONFIRM_SALE',
    'phones',
    p_phone_id,
    jsonb_build_object('inventory_code', v_phone.inventory_code, 'final_price', p_final_price)
  );

  return v_sale;
exception
  when unique_violation then
    raise exception 'Máy này đã có giao dịch bán hợp lệ';
end;
$$;

create or replace function public.undo_sale(p_sale_id uuid, p_reason text)
returns public.sales
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_sale public.sales%rowtype;
begin
  if public.my_role() <> 'ADMIN' then
    raise exception 'Chỉ Admin được hoàn tác giao dịch';
  end if;

  if nullif(trim(p_reason), '') is null then
    raise exception 'Bắt buộc nhập lý do hoàn tác';
  end if;

  select * into v_sale from public.sales where id = p_sale_id for update;
  if not found then
    raise exception 'Không tìm thấy giao dịch';
  end if;

  if v_sale.voided_at is not null then
    raise exception 'Giao dịch đã được hoàn tác';
  end if;

  perform set_config('app.allow_sale_update', 'on', true);

  update public.sales
  set voided_at = now(),
      voided_by = v_user,
      void_reason = p_reason
  where id = p_sale_id
  returning * into v_sale;

  update public.phones
  set status = 'CON_HANG',
      sold_at = null
  where id = v_sale.phone_id;

  perform public.log_audit(
    v_user,
    'UNDO_SALE',
    'sales',
    p_sale_id,
    jsonb_build_object('reason', p_reason, 'phone_id', v_sale.phone_id)
  );

  return v_sale;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('phone-images', 'phone-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/heic'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "phone_images_bucket_read"
on storage.objects for select
to authenticated
using (bucket_id = 'phone-images' and public.is_active_user());

create policy "phone_images_bucket_upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'phone-images' and public.is_active_user());

create policy "phone_images_bucket_update_admin"
on storage.objects for update
to authenticated
using (bucket_id = 'phone-images' and public.my_role() = 'ADMIN')
with check (bucket_id = 'phone-images' and public.my_role() = 'ADMIN');
