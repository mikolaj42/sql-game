-- Unique usernames (case-insensitive: "Anna" and "anna" are the same name).
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run. Safe to run again.
-- Run supabase_setup.sql first if you have not already.

-- One profile per user, holding the username.
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  username   text not null,
  created_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[A-Za-z0-9_]{3,20}$')
);

-- This index is what really guarantees uniqueness, even when two people register at the same moment.
create unique index if not exists profiles_username_lower_key on public.profiles (lower(username));

-- A signed-in user can read only their own profile. Nobody can write to the table directly;
-- profiles are created only by the two functions below.
alter table public.profiles enable row level security;
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select
  using (auth.uid() = user_id);

-- Is this username valid, not reserved and not taken? The registration form calls this before creating the account.
create or replace function public.username_available(uname text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select uname ~ '^[A-Za-z0-9_]{3,20}$'
     and lower(uname) <> all (array['admin','administrator','root','support','staff','moderator','system','boss','owner','official'])
     and not exists (select 1 from public.profiles p where lower(p.username) = lower(uname));
$$;
revoke all on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;

-- Lets a signed-in user choose a username (used after Google/Facebook login and for accounts created before usernames existed).
create or replace function public.set_username(uname text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.';
  end if;
  if not public.username_available(uname) then
    raise exception 'username not available';
  end if;
  insert into public.profiles (user_id, username) values (auth.uid(), uname);
end;
$$;
revoke all on function public.set_username(text) from public, anon;
grant execute on function public.set_username(text) to authenticated;

-- When someone registers with email and password, the form sends the username along with the sign-up.
-- This trigger creates the profile in the same step, so the account is not created at all if the name is taken.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  uname text := new.raw_user_meta_data ->> 'username';
begin
  if uname is not null and uname <> '' then
    if not public.username_available(uname) then
      raise exception 'username not available';
    end if;
    insert into public.profiles (user_id, username) values (new.id, uname);
  end if;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
