drop policy if exists "phones_update_admin_or_granted" on public.phones;

create policy "phones_update_admin_or_granted"
on public.phones for update
to authenticated
using (
  public.my_role() = 'ADMIN'
  or (
    status in ('CON_HANG', 'CHO_XAC_MINH', 'DA_GIU', 'LUU_TRU')
    and added_by = auth.uid()
  )
  or (
    status in ('CON_HANG', 'CHO_XAC_MINH', 'DA_GIU', 'LUU_TRU')
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
    status in ('CON_HANG', 'CHO_XAC_MINH', 'DA_GIU', 'LUU_TRU')
    and added_by = auth.uid()
  )
  or (
    status in ('CON_HANG', 'CHO_XAC_MINH', 'DA_GIU', 'LUU_TRU')
    and exists (
      select 1
      from public.phone_edit_permissions p
      where p.phone_id = phones.id
        and p.user_id = auth.uid()
    )
  )
);
