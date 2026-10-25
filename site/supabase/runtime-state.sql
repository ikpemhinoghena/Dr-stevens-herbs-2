-- Additive migration. Existing products, orders and administrator accounts are preserved.
create table if not exists public.app_sessions (
 token text primary key check (length(token)=64),
 user_id uuid not null references auth.users(id) on delete cascade,
 expires bigint not null,
 created_at timestamptz not null default now()
);
create index if not exists app_sessions_expiry on public.app_sessions(expires);
create table if not exists public.app_settings (key text primary key,value jsonb not null);
create table if not exists public.app_rate_limits (key text primary key,count integer not null,expires bigint not null);
alter table public.app_sessions enable row level security;
alter table public.app_settings enable row level security;
alter table public.app_rate_limits enable row level security;
revoke all on public.app_sessions,public.app_settings,public.app_rate_limits from anon,authenticated;
grant all on public.app_sessions,public.app_settings,public.app_rate_limits to service_role;
create or replace function public.check_app_rate_limit(rate_key text,maximum integer,window_ms integer)
returns boolean language plpgsql security invoker set search_path=public as $$
declare current_ms bigint := floor(extract(epoch from clock_timestamp())*1000); hits integer;
begin
 delete from public.app_rate_limits where expires<current_ms;
 insert into public.app_rate_limits(key,count,expires) values(rate_key,1,current_ms+window_ms)
 on conflict(key) do update set count=app_rate_limits.count+1 returning count into hits;
 return hits<=maximum;
end; $$;
revoke all on function public.check_app_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.check_app_rate_limit(text,integer,integer) to service_role;
