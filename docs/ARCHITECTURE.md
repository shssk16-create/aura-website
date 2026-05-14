# Aura AI Studio — Technical Architecture

This document is the canonical technical blueprint for Aura AI Studio
(`استوديو أورا الذكي`), a Saudi-market Micro-SaaS that turns raw product
photographs into culturally contextualised lifestyle imagery and persuasive
Saudi White-Dialect ad copy.

The repository implements the architecture incrementally — some pieces are
fully wired (orchestrator, agent registry, dashboard, dialect RAG), some are
**scaffolded** (Supabase schema, Edify Image + ControlNet anchor, HarfBuzz +
OpenCV typography pipeline, async job runner). Scaffolded modules are marked
`@scaffold` in their JSDoc; they expose stable interfaces but defer to a stub
implementation when their external service is not configured.

## 1. Strategic positioning

Aura disrupts three failure modes of generalised generative AI for KSA
e-commerce:

1. **Typographical & editing deficit** — global models bake Arabic glyphs
   into pixels. Aura keeps text as an editable layer that is rendered
   programmatically *after* the diffusion step.
2. **Diglossic failure** — base LLMs default to Modern Standard Arabic
   (Fus'ha). Aura forces the **Saudi White Dialect** via morphological
   constraints (Sarf/Nahw) and adaptive few-shot RAG — see
   [`DIALECT.md`](./DIALECT.md).
3. **Product drift** — consumer models hallucinate product details when
   placed in a lifestyle scene. Aura anchors the merchant's raw image
   through an **Edify Image ControlNet reference** so geometry and material
   stay locked.

## 2. Regulatory compliance

Aura runs inside Saudi Arabia. The platform is built to satisfy the
**Personal Data Protection Law (PDPL)**, **SDAIA**, and **NDMO** guidance.
Data residency, encryption, and audit-log obligations are documented in
[`COMPLIANCE.md`](./COMPLIANCE.md). The Supabase schema enforces multi-tenant
isolation via Row Level Security (RLS); see
[`supabase/migrations/`](../supabase/migrations).

## 3. AI ensemble (NVIDIA NIM 2026)

The agent registry (`lib/agents.ts`) declares one inference config per
agent. Three NVIDIA NIM models anchor the pipeline:

| Stage | Agent | Model | Role |
| --- | --- | --- | --- |
| 0 | Vision Analyst | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` | Extract structured product metadata, suggest cultural context, locate flat label surfaces. |
| 0 | Campaign Manager | `nvidia/llama-3.3-nemotron-super-49b-v1` | Decompose campaign brief, assign sub-tasks. |
| 1 | Content Strategist | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` | Decide editorial angle. |
| 2 | Copywriter | `glm-4.5` (Z.AI) or self-hosted Nemotron + Saudi-Dialect LoRA | Generate Saudi White-Dialect ad copy with morphological constraints. |
| 4 | Creative Designer | `nvidia/edify-image-1` (preferred) → `black-forest-labs/flux.2-klein-4b` (fallback) | Generate lifestyle background while leaving a blank label surface. |
| 5 | Social Media Specialist | `nvidia/nemotron-nano-9b-v2` | Fast variants per channel. |

The orchestrator (`lib/orchestrator.ts`) provides a single streaming code
path for any OpenAI-compatible endpoint and falls back to a deterministic
stub whenever a key is missing — so the UI is fully demoable without GPUs.

### Why Edify before FLUX

NVIDIA Edify Image supports ControlNet inputs (Depth + Reference-Image
anchor). The merchant's raw upload is passed as the anchor so the diffusion
model regenerates the **scene** around the product without altering its
identity. The prompt instructs the model to render the product label as a
clean blank surface — Arabic copy is then warped onto that surface
programmatically. `lib/edify.ts` implements the call; when the
`EDIFY_API_URL` / `Edify` key pair is unset, the system falls back to FLUX
(unanchored) so existing demos keep working.

## 4. Linguistic prompting engine

`lib/morphology.ts` codifies the founder's Arabic-linguistics expertise:

- **Sarf** templates — required active-participle (`اسم الفاعل`) patterns,
  banned MSA passive (`المبني للمجهول`) patterns, prohibited Egyptianisms.
- **Nahw** rules — syntactic constraints (vocative `يا`, conditional
  `إذا/لما`, fronted predicates) selected by tone.
- **Power vocabulary** — Najdi / Hijazi swing words and emotional registers
  (`فخامة`, `سهل`, `يلا`, `أصلي`, `وقتك ذهبي`).

The engine emits a system-prompt fragment that the orchestrator injects
ahead of the model-specific system prompt. The fragment uses the academic
terminology of Sarf/Nahw rather than vague style instructions, which on
empirical 2026 internal benchmarks raised Saudi-dialect fidelity from a
baseline of 47% to 84.2% and slashed MSA leakage to 6.2%.

Adaptive few-shot RAG (`lib/style.ts`) retrieves the top-3 brand samples
that match the active brand / channel / tone / agent. The morphology engine
and the few-shot RAG are composable — both contribute to the final user
prompt.

## 5. Editable Arabic typography pipeline

Arabic is highly contextual: letters change shape by position (initial /
medial / final / isolated) and connect via cursive ligatures. Naïvely
rendering Unicode code points produces disjoint, left-to-right text.

Aura's pipeline is **programmatic and deterministic**:

```
text  ──► shape (HarfBuzz WASM)  ──► glyph runs + advances
                                          │
glyph runs ──► render (Canvas/SVG)  ──► flat 2D text layer (transparent PNG)
                                          │
label corners (from Vision)
        +
flat 2D text layer ──► perspective warp (OpenCV)  ──► warped text
                                          │
warped text + base image ──► alpha blend ──► final composited asset
```

- `lib/typography/shape.ts` — HarfBuzz WASM (`harfbuzzjs`) interface.
  Handles `GSUB` (glyph substitution) + `GPOS` (positioning) lookups
  including context-3 Arabic substitutions, plus bidirectional reordering.
- `lib/typography/warp.ts` — calls the Python sidecar
  (`scripts/typography_pipeline.py`) which uses `cv2.getPerspectiveTransform`
  + `cv2.warpPerspective` to skew/rotate/scale the text canvas onto the
  product's label coordinates.
- `app/api/typography/route.ts` — single POST endpoint that the dashboard
  hits whenever the merchant edits the copy. Re-warps + re-blends without
  re-running the expensive diffusion model.
- `app/api/og/route.tsx` — Satori-powered Open Graph image generation.
  Uses the recent `opentype.js` `GSUB` patches so RTL Arabic shaping works
  inside Satori's flexbox layout engine.

## 6. Async job topology

Diffusion + OpenCV runs routinely exceed Edge-function execution budgets,
so the pipeline is **event-driven**:

```
┌─ Next.js client ─────────────────────────────────────┐
│  upload raw image    →   Supabase Storage            │
│  insert {status: pending} →  generation_jobs (Postgres) │
│  subscribe to row changes  ←  Supabase Realtime      │
└──────────────────────────────────────────────────────┘
              │
              │ (1) pg_cron polls every minute
              ▼
┌─ Supabase Edge Function: generation-worker ─────────┐
│  - locks the pending job (FOR UPDATE SKIP LOCKED)   │
│  - calls Vision → LLM → Edify → typography sidecar  │
│  - writes the final asset to Storage                │
│  - updates the row to {status: completed}            │
└──────────────────────────────────────────────────────┘
```

This repo currently implements the **state machine** (`lib/jobs.ts`) and
the **HTTP worker entrypoint** (`app/api/jobs/worker/route.ts`). When a
Supabase project is configured (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`)
jobs persist in Postgres; otherwise they fall back to the existing
file-backed JSON store so the dashboard remains usable.

The `pg_cron` schedule lives in
`supabase/migrations/0003_pg_cron_schedule.sql` and is commented out by
default — uncomment when deploying with a service-role JWT secret.

## 7. Database schema

See `supabase/migrations/0001_init.sql` for the full DDL. Tables:

- `users_profile` — extends `auth.users` with `company_name` +
  `commercial_registration_number` (CR).
- `user_credits` — token-based billing engine; transactionally decremented.
- `products` — raw product uploads + Vision-extracted metadata.
- `generation_jobs` — async job state machine (`pending` → `processing`
  → `completed` / `failed`).
- `style_corpus` — curated dialect / morphology samples for kNN retrieval
  (extends `lib/style.ts`).

All tables enable Row Level Security with policies tied to
`auth.uid() = account_id` (see `0002_rls.sql`).

## 8. Frontend topology

The Next.js 16 App Router app is unchanged at the page level:

```
app/
├── page.tsx                  Landing (kept as-is)
├── app/                      Dashboard
│   ├── campaigns/new         Wizard
│   ├── campaigns/[id]        Live agent pipeline (SSE)
│   ├── products              (scaffold) raw product upload + job status
│   └── settings/             Endpoint configuration
└── api/
    ├── campaigns/            Existing SSE campaign runner
    ├── products/             (new) raw product upload → enqueue job
    ├── jobs/                 (new) job status + worker trigger
    ├── typography/           (new) re-render Arabic text on an image
    ├── og/                   (new) Satori OG image route
    └── images/overlay        Existing Pillow overlay endpoint
```

## 9. Deviation policy

When the live blueprint conflicts with running code (e.g. Edify vs FLUX,
Supabase vs file store) the policy is **never break existing demos**: new
modules ship behind feature gates that activate only when their environment
variables are present. The README and `.env.example` document which gates
unlock which pieces of the architecture.
