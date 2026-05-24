-- ════════════════════════════════════════════════
-- Anna's Story — Initial Schema Migration
-- Run this in Supabase → SQL Editor
-- ════════════════════════════════════════════════

-- ── Tables ───────────────────────────────────────

create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_ka     text not null,
  name_ru     text not null,
  name_en     text not null,
  cover_url   text,
  sort_order  int default 0,
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists products (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  category_id     uuid references categories(id) on delete set null,
  name_ka         text not null,
  name_ru         text not null,
  name_en         text not null,
  description_ka  text,
  description_ru  text,
  description_en  text,
  price           numeric(10,2) not null,
  sizes           text[]  default '{}',
  colors          text[]  default '{}',
  images          text[]  default '{}',
  is_active       boolean default true,
  is_featured     boolean default false,
  sort_order      int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table if not exists bundles (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name_ka        text not null,
  name_ru        text not null,
  name_en        text not null,
  description_ka text,
  description_ru text,
  description_en text,
  price          numeric(10,2) not null,
  original_price numeric(10,2),
  cover_url      text,
  is_active      boolean default true,
  sort_order     int default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table if not exists bundle_products (
  bundle_id   uuid references bundles(id) on delete cascade,
  product_id  uuid references products(id) on delete cascade,
  quantity    int default 1,
  primary key (bundle_id, product_id)
);

create type if not exists order_status as enum ('new', 'processing', 'completed', 'cancelled');

create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  customer_name    text,
  customer_phone   text,
  items            jsonb not null,
  total_price      numeric(10,2),
  status           order_status default 'new',
  notes            text,
  whatsapp_sent_at timestamptz,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ── Updated-at trigger ────────────────────────────

create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on categories
  for each row execute function handle_updated_at();
create trigger set_updated_at before update on products
  for each row execute function handle_updated_at();
create trigger set_updated_at before update on bundles
  for each row execute function handle_updated_at();
create trigger set_updated_at before update on orders
  for each row execute function handle_updated_at();

-- ── Row Level Security ────────────────────────────

alter table categories    enable row level security;
alter table products      enable row level security;
alter table bundles       enable row level security;
alter table bundle_products enable row level security;
alter table orders        enable row level security;

-- Public read (active only)
create policy "public read categories"
  on categories for select using (is_active = true);
create policy "public read products"
  on products for select using (is_active = true);
create policy "public read bundles"
  on bundles for select using (is_active = true);
create policy "public read bundle_products"
  on bundle_products for select using (true);

-- Admin full access
create policy "admin full access categories"
  on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "admin full access products"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "admin full access bundles"
  on bundles for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "admin full access bundle_products"
  on bundle_products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Orders
create policy "public insert orders"
  on orders for insert with check (true);
create policy "admin read orders"
  on orders for select
  using (auth.role() = 'authenticated');
create policy "admin update orders"
  on orders for update
  using (auth.role() = 'authenticated');

-- ── Storage Buckets ───────────────────────────────

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('categories', 'categories', true)
on conflict (id) do nothing;

create policy "public read products images"
  on storage.objects for select using (bucket_id = 'products');
create policy "admin upload products images"
  on storage.objects for insert
  with check (bucket_id = 'products' and auth.role() = 'authenticated');
create policy "admin delete products images"
  on storage.objects for delete
  using (bucket_id = 'products' and auth.role() = 'authenticated');
create policy "public read categories images"
  on storage.objects for select using (bucket_id = 'categories');
create policy "admin upload categories images"
  on storage.objects for insert
  with check (bucket_id = 'categories' and auth.role() = 'authenticated');
