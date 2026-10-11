create table if not exists public.phone_edit_permissions (
  id uuid primary key default gen_random_uuid(),
  phone_id uuid not null references public.phones(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  granted_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (phone_id, user_id)
);

create index if not exists phone_edit_permissions_phone_idx on public.phone_edit_permissions(phone_id);
create index if not exists phone_edit_permissions_user_idx on public.phone_edit_permissions(user_id);

alter table public.phone_edit_permissions enable row level security;

drop policy if exists "phone_edit_permissions_select_active" on public.phone_edit_permissions;
drop policy if exists "phone_edit_permissions_admin_insert" on public.phone_edit_permissions;
drop policy if exists "phone_edit_permissions_admin_delete" on public.phone_edit_permissions;

create policy "phone_edit_permissions_select_active"
on public.phone_edit_permissions for select
to authenticated
using (public.is_active_user());

create policy "phone_edit_permissions_admin_insert"
on public.phone_edit_permissions for insert
to authenticated
with check (public.my_role() = 'ADMIN' and granted_by = auth.uid());

create policy "phone_edit_permissions_admin_delete"
on public.phone_edit_permissions for delete
to authenticated
using (public.my_role() = 'ADMIN');

drop policy if exists "phones_update_admin_or_owner_available" on public.phones;
drop policy if exists "phones_update_admin_or_granted" on public.phones;

create policy "phones_update_admin_or_granted"
on public.phones for update
to authenticated
using (
  public.my_role() = 'ADMIN'
  or (
    status in ('CON_HANG', 'CHO_XAC_MINH', 'DA_GIU')
    and exists (
      select 1
      from public.phone_edit_permissions p
      where p.phone_id = phones.id
        and p.user_id = auth.uid()
    )
  )
)
with check (
  public.my_role() = 'ADMIN'
  or (
    status in ('CON_HANG', 'CHO_XAC_MINH', 'DA_GIU')
    and exists (
      select 1
      from public.phone_edit_permissions p
      where p.phone_id = phones.id
        and p.user_id = auth.uid()
    )
  )
);

create or replace function public.log_phone_edit_permission()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.log_audit(
      auth.uid(),
      'GRANT_PHONE_EDIT',
      'phones',
      new.phone_id,
      jsonb_build_object('user_id', new.user_id)
    );
    return new;
  end if;

  perform public.log_audit(
    auth.uid(),
    'REVOKE_PHONE_EDIT',
    'phones',
    old.phone_id,
    jsonb_build_object('user_id', old.user_id)
  );
  return old;
end;
$$;

drop trigger if exists phone_edit_permissions_audit_insert on public.phone_edit_permissions;
drop trigger if exists phone_edit_permissions_audit_delete on public.phone_edit_permissions;

create trigger phone_edit_permissions_audit_insert
after insert on public.phone_edit_permissions
for each row execute function public.log_phone_edit_permission();

create trigger phone_edit_permissions_audit_delete
after delete on public.phone_edit_permissions
for each row execute function public.log_phone_edit_permission();
