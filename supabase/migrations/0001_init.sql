-- Aura AI Studio — base schema.
--
-- Tenant-bound tables all carry `account_id uuid references users_profile(id)`.
-- Row Level Security policies live in 0002_rls.sql. The pg_cron worker
-- schedule lives in 0003_pg_cron_schedule.sql.

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- users_profile — extends auth.users with KSA-business metadata.
-- ---------------------------------------------------------------------------
create table if not exists public.users_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text not null,
  -- Saudi Commercial Registration (السجل التجاري) — 10 digits.
  commercial_registration_number text,
  preferred_locale text not null default 'ar-SA',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_profile_company_idx
  on public.users_profile (company_name);

-- ---------------------------------------------------------------------------
-- user_credits — tokenised SaaS billing engine.
-- Isolated from users_profile so balance updates can be done atomically
-- without locking the profile row.
-- ---------------------------------------------------------------------------
create table if not exists public.user_credits (
  account_id uuid primary key references public.users_profile(id) on delete cascade,
  available_tokens integer not null default 0 check (available_tokens >= 0),
  subscription_tier text not null default 'free'
    check (subscription_tier in ('free', 'pro', 'enterprise')),
  last_refilled_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- products — raw product uploads + Vision-extracted metadata.
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.users_profile(id) on delete cascade,
  display_name text not null,
  -- Path to the raw upload inside the `products` storage bucket.
  raw_storage_path text not null,
  -- Structured metadata produced by the vision agent. Shape:
  --   {
  --     "description": "...",
  --     "dominant_colors": ["#RRGGBB", ...],
  --     "materials": ["matte plastic", ...],
  --     "label_surfaces": [
  --       { "label": "front", "polygon": [[x1,y1], ..., [x4,y4]] }
  --     ],
  --     "cultural_context_hints": ["majlis", "outdoor", ...]
  --   }
  vision_metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_account_idx
  on public.products (account_id, created_at desc);

-- ---------------------------------------------------------------------------
-- generation_jobs — async job state machine.
-- ---------------------------------------------------------------------------
create type public.generation_job_status as enum (
  'pending',
  'processing',
  'completed',
  'failed'
);

create table if not exists public.generation_jobs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.users_profile(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  status public.generation_job_status not null default 'pending',
  -- Full pipeline input (brand, tone, channel, headline, etc.).
  input jsonb not null,
  -- Stage progress, last-error, etc.
  progress jsonb not null default '{}'::jsonb,
  -- Output asset references.
  output jsonb,
  -- Worker concurrency control — set by the worker via SELECT ... FOR
  -- UPDATE SKIP LOCKED.
  locked_at timestamptz,
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists generation_jobs_status_idx
  on public.generation_jobs (status, created_at);

create index if not exists generation_jobs_account_idx
  on public.generation_jobs (account_id, created_at desc);

-- ---------------------------------------------------------------------------
-- style_corpus — proprietary KSA dialect samples for kNN retrieval.
-- This extends the file-backed store in `lib/style.ts` with multi-tenant
-- isolation. The embedding column is optional — populate it when a Postgres
-- extension like `pgvector` is enabled.
-- ---------------------------------------------------------------------------
create table if not exists public.style_corpus (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.users_profile(id) on delete cascade,
  brand text not null,
  channel text not null default 'any',
  tone text not null default 'any',
  agents text[] not null default '{copywriter}',
  body text not null,
  label text not null,
  -- Optional pgvector column. When present, top-k retrieval uses
  --   ORDER BY embedding <=> $query LIMIT 3
  -- Comment kept as documentation rather than a hard dependency.
  -- embedding vector(1024),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists style_corpus_account_brand_idx
  on public.style_corpus (account_id, brand);

-- ---------------------------------------------------------------------------
-- audit_log — append-only SDAIA-compliant audit trail.
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.users_profile(id) on delete set null,
  actor text not null,
  action text not null,
  target_table text,
  target_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_account_idx
  on public.audit_log (account_id, created_at desc);

-- Append-only — no updates/deletes via RLS. The cascade on
-- users_profile is set to SET NULL so deletion of a user does not erase
-- their audit trail (PDPL allows preservation for legal / compliance
-- purposes even after a deletion request).

-- ---------------------------------------------------------------------------
-- updated_at triggers.
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'users_profile',
      'user_credits',
      'products',
      'generation_jobs',
      'style_corpus'
    ])
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I;', t
    );
    execute format(
      'create trigger set_updated_at before update on public.%I '
      'for each row execute function public.set_updated_at();', t
    );
  end loop;
end;
$$;
