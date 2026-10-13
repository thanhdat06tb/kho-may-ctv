create or replace function public.delete_phone(p_phone_id uuid)
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
    raise exception 'Bạn cần đăng nhập để xóa máy';
  end if;

  select *
  into v_phone
  from public.phones
  where id = p_phone_id
  for update;

  if not found then
    raise exception 'Không tìm thấy máy';
  end if;

  if v_phone.status = 'DA_BAN' or exists (select 1 from public.sales where phone_id = p_phone_id) then
    raise exception 'Máy đã có giao dịch nên không thể xóa';
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
    raise exception 'Bạn chưa có quyền xóa máy này';
  end if;

  perform public.log_audit(
    v_actor,
    'delete_phone',
    'phone',
    p_phone_id,
    jsonb_build_object('inventory_code', v_phone.inventory_code, 'name', v_phone.name)
  );

  delete from storage.objects
  where bucket_id = 'phone-images'
    and name in (
      select storage_path
      from public.phone_images
      where phone_id = p_phone_id
    );

  delete from public.phones
  where id = p_phone_id;
end;
$$;

grant execute on function public.delete_phone(uuid) to authenticated;
