-- Lets a signed-in user change their username (Account & settings in the game).
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run. Safe to run again.
-- Run supabase_usernames.sql first if you have not already.

-- When the name was last changed, so it cannot be changed again and again.
alter table public.profiles add column if not exists username_changed_at timestamptz;

-- Changes the username of the signed-in user. Rules: valid format, not taken by someone else
-- (changing only the capital letters of your own name is fine), and at most once every 14 days.
create or replace function public.change_username(uname text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  cur public.profiles;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.';
  end if;
  select * into cur from public.profiles where user_id = auth.uid();
  if not found then
    raise exception 'Choose a username first.';
  end if;
  if uname !~ '^[A-Za-z0-9_]{3,20}$' then
    raise exception 'username not available';
  end if;
  if lower(cur.username) <> lower(uname) and not public.username_available(uname) then
    raise exception 'username not available';
  end if;
  if cur.username_changed_at is not null and cur.username_changed_at > now() - interval '14 days' then
    raise exception 'too soon: you can change your username again after %', to_char(cur.username_changed_at + interval '14 days', 'YYYY-MM-DD');
  end if;
  update public.profiles set username = uname, username_changed_at = now() where user_id = auth.uid();
end;
$$;
revoke all on function public.change_username(text) from public, anon;
grant execute on function public.change_username(text) to authenticated;
