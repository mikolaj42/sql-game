-- Accounts allowed to use admin mode (the switch that bypasses level and database locks).
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run. Safe to run again.
-- Run supabase_setup.sql first if you have not already.

create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now(),
  constraint admins_email_lowercase check (email = lower(email))
);

-- Nobody can read or change this list through the app: row level security is on and there are no policies.
-- Only the function below can read it, and it only ever answers "yes" or "no" about the signed-in account.
alter table public.admins enable row level security;

-- Is the signed-in account on the list? The email must also be confirmed, so nobody can claim an
-- address by registering with it and skipping the confirmation.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users u
    join public.admins a on a.email = lower(u.email)
    where u.id = auth.uid()
      and u.email_confirmed_at is not null
  );
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- The first administrator.
insert into public.admins (email) values ('mikolaj.jedraszka@gmail.com') on conflict do nothing;

-- To add another one later, run:   insert into public.admins (email) values ('someone@example.com');
-- To remove one:                   delete from public.admins where email = 'someone@example.com';
-- Always use lowercase letters for the address.
