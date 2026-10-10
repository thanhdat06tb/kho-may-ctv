create or replace function public.get_dashboard_summary()
returns table (
  available_count bigint,
  sold_count bigint,
  total_revenue numeric,
  month_sales_count bigint
)
language sql
security definer
stable
set search_path = public
as $$
  select
    (select count(*) from public.phones where status = 'CON_HANG') as available_count,
    (select count(*) from public.phones where status = 'DA_BAN') as sold_count,
    coalesce((select sum(final_price) from public.sales where voided_at is null), 0) as total_revenue,
    (
      select count(*)
      from public.sales
      where voided_at is null
        and sold_at >= date_trunc('month', now())
    ) as month_sales_count
  where public.is_active_user();
$$;

create or replace function public.get_sales_ranking(p_from timestamptz default null, p_to timestamptz default null)
returns table (
  seller_id uuid,
  name text,
  count bigint,
  total numeric,
  last timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    s.seller_id,
    p.full_name as name,
    count(*) as count,
    coalesce(sum(s.final_price), 0) as total,
    max(s.sold_at) as last
  from public.sales s
  join public.profiles p on p.id = s.seller_id
  where public.is_active_user()
    and s.voided_at is null
    and (p_from is null or s.sold_at >= p_from)
    and (p_to is null or s.sold_at <= p_to)
  group by s.seller_id, p.full_name
  order by total desc, count desc, last desc;
$$;
