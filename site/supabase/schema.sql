-- Run once in the SQL Editor of your own Supabase project.
create table if not exists public.products (
 id text primary key check (id ~ '^[a-z0-9-]{1,100}$'),
 body jsonb not null check (jsonb_typeof(body) = 'object'),
 status text not null default 'draft' check (status in ('draft','published','archived')),
 revision integer not null default 1 check (revision > 0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.product_admins (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.products enable row level security;
alter table public.product_admins enable row level security;
-- Only the server service key can read/write these tables. No public signup grants admin rights.
revoke all on public.products from anon, authenticated;
revoke all on public.product_admins from anon, authenticated;
grant all on public.products to service_role;
grant all on public.product_admins to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;
-- Public product photos can be viewed; no client upload/write policies are created.
-- Create the doctor's user in Authentication > Users, then grant access:
-- insert into public.product_admins(user_id) values ('THE-AUTH-USER-UUID');
create table if not exists public.orders (
 id text primary key,
 request_key text not null unique,
 body jsonb not null check (jsonb_typeof(body) = 'object'),
 revision integer not null default 1,
 created_at timestamptz not null default now()
);
alter table public.orders enable row level security;
revoke all on public.orders from anon,authenticated;
grant all on public.orders to service_role;
