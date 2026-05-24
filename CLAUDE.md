# CLAUDE.md — Anna's Story Admin Panel

## პროექტის მიმოხილვა

**Anna's Story** — საძინებლის თეთრეულის ონლაინ კატალოგი WhatsApp-ზე გაყიდვით.
Admin Panel-ი Next.js 15 + Supabase-ზეა.

---

## Tech Stack

| ფენა | ტექნოლოგია |
|------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| i18n | next-intl (ka / ru / en) |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| UI Components | shadcn/ui |
| API | Next.js API Routes (`/app/api/`) |

---

## ბრენდის ფერები

```css
--cream:    #F5F0E8;   /* ფონი */
--mink:     #C4A882;   /* პირველადი accent */
--charcoal: #2C2C2C;   /* ტექსტი */
--mink-dark:#A8906A;   /* hover */
--cream-dark:#EDE6D9;  /* card ფონი */
```

---

## დირექტორიის სტრუქტურა

```
anna-story/
├── app/
│   ├── [locale]/              # next-intl locale wrapper
│   │   ├── page.tsx           # მთავარი გვერდი (კატალოგი)
│   │   ├── category/[slug]/
│   │   └── bundle/[slug]/
│   ├── admin/                 # Admin Panel (unlocalized, Georgian only)
│   │   ├── layout.tsx         # Auth guard + sidebar layout
│   │   ├── page.tsx           # Dashboard (redirect → /admin/products)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx       # პროდუქტების სია
│   │   │   ├── new/page.tsx   # ახალი პროდუქტი
│   │   │   └── [id]/page.tsx  # რედაქტირება
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── bundles/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── orders/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   └── api/
│       ├── admin/
│       │   ├── products/
│       │   │   ├── route.ts          # GET (list) / POST (create)
│       │   │   └── [id]/route.ts     # GET / PUT / DELETE
│       │   ├── categories/
│       │   │   ├── route.ts
│       │   │   └── [id]/route.ts
│       │   ├── bundles/
│       │   │   ├── route.ts
│       │   │   └── [id]/route.ts
│       │   ├── orders/
│       │   │   ├── route.ts
│       │   │   └── [id]/route.ts
│       │   └── upload/
│       │       └── route.ts          # Supabase Storage upload
│       └── public/
│           ├── products/route.ts     # public catalog API
│           └── categories/route.ts
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── ProductForm.tsx
│   │   ├── CategoryForm.tsx
│   │   ├── BundleForm.tsx
│   │   └── OrderStatusBadge.tsx
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # browser client
│   │   ├── server.ts          # server client (cookies)
│   │   └── admin.ts           # service role client
│   ├── categories-data.ts     # legacy static data (migration source)
│   ├── data/
│   │   └── bundles.ts         # legacy static data (migration source)
│   └── utils.ts
├── middleware.ts               # next-intl + admin auth guard
└── types/
    ├── database.ts             # Supabase generated types
    └── admin.ts
```

---

## Supabase სქემა

### ცხრილი: `categories`

```sql
create table categories (
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
```

### ცხრილი: `products`

```sql
create table products (
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
```

### ცხრილი: `bundles`

```sql
create table bundles (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name_ka      text not null,
  name_ru      text not null,
  name_en      text not null,
  description_ka text,
  description_ru text,
  description_en text,
  price        numeric(10,2) not null,
  original_price numeric(10,2),
  cover_url    text,
  is_active    boolean default true,
  sort_order   int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
```

### ცხრილი: `bundle_products`

```sql
create table bundle_products (
  bundle_id   uuid references bundles(id) on delete cascade,
  product_id  uuid references products(id) on delete cascade,
  quantity    int default 1,
  primary key (bundle_id, product_id)
);
```

### ცხრილი: `orders`

```sql
create type order_status as enum ('new', 'processing', 'completed', 'cancelled');

create table orders (
  id            uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_phone text,
  items         jsonb not null,
  total_price   numeric(10,2),
  status        order_status default 'new',
  notes         text,
  whatsapp_sent_at timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
```

### RLS Policies

```sql
alter table categories enable row level security;
alter table products    enable row level security;
alter table bundles     enable row level security;
alter table bundle_products enable row level security;
alter table orders      enable row level security;

create policy "public read categories"
  on categories for select using (is_active = true);
create policy "public read products"
  on products for select using (is_active = true);
create policy "public read bundles"
  on bundles for select using (is_active = true);
create policy "public read bundle_products"
  on bundle_products for select using (true);

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

create policy "public insert orders"
  on orders for insert with check (true);
create policy "admin read update orders"
  on orders for select
  using (auth.role() = 'authenticated');
create policy "admin update orders"
  on orders for update
  using (auth.role() = 'authenticated');
```

### Triggers

```sql
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
```

### Supabase Storage Buckets

```sql
insert into storage.buckets (id, name, public)
values ('products', 'products', true);
insert into storage.buckets (id, name, public)
values ('categories', 'categories', true);

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
```

---

## API Routes სტრუქტურა

ყველა admin route იყენებს `withAdminAuth()` wrapper-ს:

```typescript
// lib/supabase/server.ts
export async function withAdminAuth(
  req: NextRequest,
  handler: (supabase: SupabaseClient, user: User) => Promise<NextResponse>
): Promise<NextResponse> {
  const supabase = createServerClient(/* cookies */);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return handler(supabase, user);
}
```

### `/api/admin/products/route.ts`
- `GET`  — სია (filter: category_id, is_active, search, page, limit)
- `POST` — შექმნა

### `/api/admin/products/[id]/route.ts`
- `GET`    — ერთი პროდუქტი
- `PUT`    — განახლება
- `DELETE` — წაშლა (soft: is_active=false ან hard delete)

### `/api/admin/categories/route.ts`
- `GET`  — ყველა კატეგორია
- `POST` — შექმნა

### `/api/admin/categories/[id]/route.ts`
- `PUT`    — განახლება
- `DELETE` — წაშლა

### `/api/admin/bundles/route.ts` + `[id]/route.ts`
- იგივე CRUD pattern

### `/api/admin/orders/route.ts`
- `GET` — სია (filter: status, date range, page)

### `/api/admin/orders/[id]/route.ts`
- `GET` — დეტალები
- `PATCH` — status განახლება

### `/api/admin/upload/route.ts`
- `POST` — multipart/form-data → Supabase Storage
- აბრუნებს: `{ url: string, path: string }`

---

## Middleware

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  // 1. Admin routes protection
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (req.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    const supabase = createMiddlewareClient(req);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // 2. next-intl for public routes
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|api|favicon).*)'],
};
```

---

## Admin Panel გვერდები

### `/admin/login`
- Email + Password ფორმა
- `supabase.auth.signInWithPassword()`
- redirect → `/admin/products`

### `/admin/products`
- ცხრილი: სახელი (KA) | კატეგორია | ფასი | სტატუსი | მოქმედებები
- ძებნა, კატეგორიით ფილტრი
- "ახალი პროდუქტი" ღილაკი

### `/admin/products/new` + `/admin/products/[id]`
- ProductForm კომპონენტი:
  - სახელი (ka/ru/en) tabs
  - აღწერა (ka/ru/en) tabs
  - კატეგორია (select)
  - ფასი
  - ზომები (multi-tag input)
  - ფერები (multi-tag input)
  - ფოტოები (drag & drop, multiple)
  - is_active toggle
  - is_featured toggle

### `/admin/categories`
- ბარათები cover ფოტოთი
- drag-to-reorder (sort_order)

### `/admin/bundles`
- ცხრილი + პროდუქტების სია per bundle
- ფასი vs original_price

### `/admin/orders`
- ცხრილი: თარიღი | მომხმარებელი | ჯამი | სტატუსი
- status filter tabs: ყველა / ახალი / დამუშავებული / დასრულებული
- კლიკზე drawer/modal დეტალებით
- სტატუსის ცვლილება

---

## გარემო ცვლადები

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # მხოლოდ server-side, არ expose!

NEXT_PUBLIC_WHATSAPP_NUMBER=+995XXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://annas-story.ge
```

---

## TypeScript Types

```typescript
// types/database.ts  (Supabase CLI-ით auto-generated)
// npx supabase gen types typescript --project-id YOUR_ID > types/database.ts

// types/admin.ts
export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';

export interface ProductFormData {
  slug: string;
  category_id: string | null;
  name_ka: string; name_ru: string; name_en: string;
  description_ka: string; description_ru: string; description_en: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
}
```

---

## დაყენების ნაბიჯები

### 1. Supabase პაკეტები
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. shadcn/ui
```bash
npx shadcn@latest init
npx shadcn@latest add \
  button input label textarea select \
  table badge dialog sheet tabs \
  card separator skeleton \
  dropdown-menu alert-dialog \
  toast sonner
```

### 3. Types Generate
```bash
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_REF \
  --schema public > types/database.ts
```

### 4. Admin მომხმარებელი (Supabase Dashboard)
```
Authentication → Users → Add user
Email: admin@annas-story.ge
Password: [strong password]
```

---

## კოდის სტანდარტები

- **TypeScript strict mode** — no `any`
- **Server Components by default** — `"use client"` მხოლოდ სადაც ინტერაქტიულობაა
- **API Routes** — ყოველთვის `withAdminAuth()` wrapper
- **Error handling** — `try/catch` + proper HTTP status codes
- **Images** — Next.js `<Image>` component, Supabase Storage URL
- **Forms** — React Hook Form + Zod validation
- **Slugs** — auto-generated from `name_en` (kebab-case)
