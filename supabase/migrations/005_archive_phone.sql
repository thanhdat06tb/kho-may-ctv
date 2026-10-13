create or replace function public.archive_phone(p_phone_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_phone public.phones%rowtype;
  v_actor uuid := auth.uid();
begin
  if v_actor is null or not public.is_active_user() then
    raise exception 'Bạn cần đăng nhập để ẩn sản phẩm';
  end if;

  select *
  into v_phone
  from public.phones
  where id = p_phone_id
  for update;

  if not found then
    raise exception 'Không tìm thấy sản phẩm';
  end if;

  if v_phone.status in ('DA_BAN', 'LUU_TRU') then
    raise exception 'Sản phẩm này không còn trong kho bán';
  end if;

  if public.my_role() <> 'ADMIN'
    and v_phone.added_by <> v_actor
    and not exists (
      select 1
      from public.phone_edit_permissions p
      where p.phone_id = p_phone_id
        and p.user_id = v_actor
    )
  then
    raise exception 'Bạn chưa có quyền ẩn sản phẩm này';
  end if;

  update public.phones
  set status = 'LUU_TRU'
  where id = p_phone_id;

  perform public.log_audit(
    v_actor,
    'archive_phone',
    'phone',
    p_phone_id,
    jsonb_build_object('inventory_code', v_phone.inventory_code, 'name', v_phone.name)
  );
end;
$$;

grant execute on function public.archive_phone(uuid) to authenticated;
