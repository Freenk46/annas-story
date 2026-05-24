-- ════════════════════════════════════════════════
-- Anna's Story — Migration 002: Additional Columns
-- Run in Supabase → SQL Editor
-- ════════════════════════════════════════════════

-- ── Categories ───────────────────────────────────
alter table categories
  add column if not exists year            int,
  add column if not exists collection_ka   text,
  add column if not exists collection_ru   text,
  add column if not exists collection_en   text,
  add column if not exists description_ka  text,
  add column if not exists description_ru  text,
  add column if not exists description_en  text;

-- ── Bundles ──────────────────────────────────────
alter table bundles
  add column if not exists subtitle_ka  text,
  add column if not exists subtitle_ru  text,
  add column if not exists subtitle_en  text,
  add column if not exists items_list   text[] default '{}';

-- ── Products ─────────────────────────────────────
alter table products
  add column if not exists subtitle_ka         text,
  add column if not exists subtitle_ru         text,
  add column if not exists subtitle_en         text,
  add column if not exists original_price      numeric(10,2),
  add column if not exists technical_info_ka   text,
  add column if not exists technical_info_ru   text,
  add column if not exists technical_info_en   text,
  add column if not exists collection          text,
  add column if not exists year                int;
