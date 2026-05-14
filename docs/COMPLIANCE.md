# Aura AI Studio — Regulatory & Compliance Architecture

Aura processes commercial and PII data for Saudi Arabia–based merchants.
The platform is engineered to satisfy the **Personal Data Protection Law
(PDPL)** and the guidance issued by **SDAIA** (Saudi Data and Artificial
Intelligence Authority) and **NDMO** (National Data Management Office).

This document is descriptive; the enforcement primitives live in code (RLS
policies, encryption helpers, audit-log hooks).

## 1. Data residency

PDPL has extraterritorial reach: any platform targeting Saudi data subjects
must govern that data under Kingdom mandates regardless of where the
servers run.

- **Primary deployment region** — a KSA cloud region (e.g. AWS Middle East
  Bahrain `me-south-1`, AWS Riyadh `me-central-1` once Supabase supports
  it, or Azure KSA availability zones). Supabase's Singapore / Frankfurt
  defaults are **not acceptable** for production.
- **Cross-border transfers** are disabled by default. Any feature that
  needs external inference (e.g. a third-party API hosted outside the KSA)
  must route through a documented Data Transfer Agreement.
- **CMEK** — sensitive columns (product designs, customer PII) are
  encrypted using Customer-Managed Encryption Keys held within the KSA via
  the deploying tenant's KMS.

## 2. Multi-tenant isolation

`auth.uid()` is the tenant boundary. Every table that holds tenant data
declares `account_id uuid references users_profile(id) on delete cascade`,
enables `row level security`, and ships with policies named:

- `read_own_<table>` — `select` only where `account_id = auth.uid()`.
- `write_own_<table>` — `insert / update / delete` only when both old and
  new `account_id = auth.uid()`.

Service-role access is reserved for the generation worker (`pg_cron` job)
and is invoked with an explicit JWT (`SUPABASE_SERVICE_ROLE_KEY`). Every
service-role write that touches a tenant row inserts a row into
`audit_log` referencing the originating job id.

## 3. Audit logging

SDAIA mandates a **five-year** record-retention window for data-processing
activities. `audit_log` records:

- `actor` (`auth.uid()` or `'system'` for cron / worker tasks)
- `action` (`generation.created`, `generation.completed`,
  `secrets.updated`, `auth.login`, …)
- `target_table` + `target_id`
- `payload` (`jsonb`, redacted of plaintext secrets)
- `created_at`

Logs are append-only — there is no `update` / `delete` policy.

## 4. Secrets

API keys for NVIDIA NIM, Z.AI, Edify, and the typography sidecar are stored
encrypted at rest in `lib/secrets.ts` (and surfaced via the dashboard's
keys page). They are **never** sent to the browser and never logged.

Locally, `.env.local` is honoured as a development fallback and is
`.gitignore`-d.

## 5. Right-to-be-forgotten

Article 18 of PDPL grants data subjects the right to deletion. The schema
supports this via `on delete cascade` on every tenant-bound table — when
the `users_profile` row is deleted, products, jobs, credits, style
samples, and audit log entries are all removed. The dashboard exposes
this as `/app/settings/account/delete` (scaffold).

## 6. Minimum runtime checklist

Before going live in KSA, verify:

- [ ] Supabase project provisioned in a KSA region (or KSA-resident
      reverse proxy with at-rest encryption).
- [ ] `SUPABASE_SERVICE_ROLE_KEY` stored only in the worker environment.
- [ ] `SUPABASE_ANON_KEY` set on the Next.js app and the only key exposed
      to the browser.
- [ ] All migrations applied; `select * from pg_policies where schemaname
      = 'public'` returns RLS policies on every tenant table.
- [ ] `audit_log` write triggers enabled.
- [ ] PDPL-compliant privacy notice and consent banner published at
      `/legal/privacy` (scaffold).
- [ ] CR (Commercial Registration) collection enabled for B2B accounts.
