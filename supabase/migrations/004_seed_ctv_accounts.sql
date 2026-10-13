create extension if not exists pgcrypto;

do $$
declare
  account record;
  account_id uuid;
  identity_has_provider_id boolean;
begin
  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
      and table_name = 'identities'
      and column_name = 'provider_id'
  )
  into identity_has_provider_id;

  for account in
    select *
    from (values
      ('Hai@gmail.com', 'Hai'),
      ('Dat@gmail.com', 'Dat'),
      ('Minh@gmail.com', 'Minh'),
      ('Duong@gmail.com', 'Duong')
    ) as accounts(email, full_name)
  loop
    select id
    into account_id
    from auth.users
    where lower(email) = lower(account.email)
      and deleted_at is null
    limit 1;

    if account_id is null then
      account_id := gen_random_uuid();

      insert into auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        email_change_token_current,
        reauthentication_token
      )
      values (
        '00000000-0000-0000-0000-000000000000',
        account_id,
        'authenticated',
        'authenticated',
        account.email,
        crypt('1', gen_salt('bf')),
        now(),
        jsonb_build_object('provider', 'email', 'providers', array['email']),
        jsonb_build_object('full_name', account.full_name, 'role', 'CTV'),
        now(),
        now(),
        '',
        '',
        '',
        '',
        '',
        ''
      );
    else
      update auth.users
      set
        encrypted_password = crypt('1', gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        confirmation_token = coalesce(confirmation_token, ''),
        recovery_token = coalesce(recovery_token, ''),
        email_change_token_new = coalesce(email_change_token_new, ''),
        email_change = coalesce(email_change, ''),
        email_change_token_current = coalesce(email_change_token_current, ''),
        reauthentication_token = coalesce(reauthentication_token, ''),
        raw_app_meta_data = jsonb_build_object('provider', 'email', 'providers', array['email']),
        raw_user_meta_data = jsonb_build_object('full_name', account.full_name, 'role', 'CTV'),
        updated_at = now()
      where id = account_id;
    end if;

    if identity_has_provider_id then
      execute $sql$
        insert into auth.identities (
          user_id,
          identity_data,
          provider,
          provider_id,
          last_sign_in_at,
          created_at,
          updated_at
        )
        values ($1, $2, 'email', $3, now(), now(), now())
        on conflict (provider, provider_id)
        do update set
          identity_data = excluded.identity_data,
          updated_at = now()
      $sql$
      using account_id, jsonb_build_object('sub', account_id::text, 'email', account.email, 'email_verified', false, 'phone_verified', false), account_id::text;
    else
      execute $sql$
        insert into auth.identities (
          id,
          user_id,
          identity_data,
          provider,
          last_sign_in_at,
          created_at,
          updated_at
        )
        values ($1, $2, $3, 'email', now(), now(), now())
        on conflict (provider, id)
        do update set
          identity_data = excluded.identity_data,
          updated_at = now()
      $sql$
      using account_id::text, account_id, jsonb_build_object('sub', account_id::text, 'email', account.email, 'email_verified', true, 'phone_verified', false);
    end if;

    insert into public.profiles (id, full_name, role, is_active)
    values (account_id, account.full_name, 'CTV', true)
    on conflict (id)
    do update set
      full_name = excluded.full_name,
      role = 'CTV',
      is_active = true;
  end loop;
end $$;
