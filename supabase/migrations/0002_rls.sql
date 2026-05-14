-- Row Level Security policies. Every tenant-bound table is keyed on
-- `account_id` and limited to `auth.uid()`. Service-role connections
-- (used by the generation worker and pg_cron) bypass RLS by design.

alter table public.users_profile  enable row level security;
alter table public.user_credits   enable row level security;
alter table public.products       enable row level security;
alter table public.generation_jobs enable row level security;
alter table public.style_corpus   enable row level security;
alter table public.audit_log      enable row level security;

-- ---------------------------------------------------------------------------
-- users_profile
-- ---------------------------------------------------------------------------
drop policy if exists "users_profile.select_own" on public.users_profile;
create policy "users_profile.select_own" on public.users_profile
  for select using (id = auth.uid());

drop policy if exists "users_profile.insert_own" on public.users_profile;
create policy "users_profile.insert_own" on public.users_profile
  for insert with check (id = auth.uid());

drop policy if exists "users_profile.update_own" on public.users_profile;
create policy "users_profile.update_own" on public.users_profile
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "users_profile.delete_own" on public.users_profile;
create policy "users_profile.delete_own" on public.users_profile
  for delete using (id = auth.uid());

-- ---------------------------------------------------------------------------
-- user_credits
-- ---------------------------------------------------------------------------
drop policy if exists "user_credits.select_own" on public.user_credits;
create policy "user_credits.select_own" on public.user_credits
  for select using (account_id = auth.uid());

-- Inserts / updates only via service role (the billing worker). Tenants
-- can read but not modify their own credit balance.

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
drop policy if exists "products.select_own" on public.products;
create policy "products.select_own" on public.products
  for select using (account_id = auth.uid());

drop policy if exists "products.insert_own" on public.products;
create policy "products.insert_own" on public.products
  for insert with check (account_id = auth.uid());

drop policy if exists "products.update_own" on public.products;
create policy "products.update_own" on public.products
  for update using (account_id = auth.uid()) with check (account_id = auth.uid());

drop policy if exists "products.delete_own" on public.products;
create policy "products.delete_own" on public.products
  for delete using (account_id = auth.uid());

-- ---------------------------------------------------------------------------
-- generation_jobs
-- ---------------------------------------------------------------------------
drop policy if exists "generation_jobs.select_own" on public.generation_jobs;
create policy "generation_jobs.select_own" on public.generation_jobs
  for select using (account_id = auth.uid());

drop policy if exists "generation_jobs.insert_own" on public.generation_jobs;
create policy "generation_jobs.insert_own" on public.generation_jobs
  for insert with check (account_id = auth.uid());

-- Only the worker (service role) updates job status; tenants cannot
-- progress their own jobs.

-- ---------------------------------------------------------------------------
-- style_corpus
-- ---------------------------------------------------------------------------
drop policy if exists "style_corpus.select_own" on public.style_corpus;
create policy "style_corpus.select_own" on public.style_corpus
  for select using (account_id = auth.uid());

drop policy if exists "style_corpus.insert_own" on public.style_corpus;
create policy "style_corpus.insert_own" on public.style_corpus
  for insert with check (account_id = auth.uid());

drop policy if exists "style_corpus.update_own" on public.style_corpus;
create policy "style_corpus.update_own" on public.style_corpus
  for update using (account_id = auth.uid()) with check (account_id = auth.uid());

drop policy if exists "style_corpus.delete_own" on public.style_corpus;
create policy "style_corpus.delete_own" on public.style_corpus
  for delete using (account_id = auth.uid());

-- ---------------------------------------------------------------------------
-- audit_log — read-own, append-only via service role.
-- ---------------------------------------------------------------------------
drop policy if exists "audit_log.select_own" on public.audit_log;
create policy "audit_log.select_own" on public.audit_log
  for select using (account_id = auth.uid());
