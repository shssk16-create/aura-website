# Aura AI Studio (`استوديو أورا الذكي`)

A Saudi-market Micro-SaaS that turns raw product photographs into
hyper-realistic lifestyle imagery and culturally accurate Saudi
White-Dialect ad copy — without "product drift," without baked-in Arabic
typography, and without the PDPL-incompatible architecture of generic
global AI tooling.

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind**, a
streaming LangChain-style agent orchestrator, and a deterministic Arabic
typography pipeline (HarfBuzz WASM shaping + OpenCV perspective warp).
Every request flows through a secure server-side proxy — API keys never
reach the browser.

> The full technical blueprint lives in **`docs/`**:
> [ARCHITECTURE](docs/ARCHITECTURE.md) ·
> [COMPLIANCE](docs/COMPLIANCE.md) ·
> [DIALECT](docs/DIALECT.md) ·
> [TYPOGRAPHY](docs/TYPOGRAPHY.md).

## Getting started

```bash
npm install
cp .env.example .env.local      # fill in inference endpoints (optional)
npm run dev                     # http://localhost:3000
```

When `*_API_URL` env vars are missing, the orchestrator falls back to
deterministic stub generators so the UI remains fully usable without GPUs.

### Optional Python tooling

Two sidecar scripts handle real Arabic rendering and OpenCV warps:

| Script | Purpose |
| --- | --- |
| [`scripts/overlay_arabic.py`](scripts/overlay_arabic.py) | Pillow + arabic-reshaper Arabic text overlay (legacy helper). |
| [`scripts/typography_pipeline.py`](scripts/typography_pipeline.py) | OpenCV perspective warp + alpha-blend (called by `/api/typography`). |

```bash
python -m pip install -r scripts/requirements.txt
```

## Architecture

```
app/                              Next.js routes
├── page.tsx                      Landing (hero · agents · how it works · pricing)
├── app/                          Dashboard
│   ├── page.tsx                  Campaign list
│   ├── campaigns/new             Wizard
│   ├── campaigns/[id]            Live agent pipeline (SSE)
│   ├── agents/                   Agent registry editor
│   └── settings/                 Endpoint configuration
└── api/
    ├── campaigns/                CRUD + run (Server-Sent Events stream)
    ├── products/                 Raw product upload + Vision analysis
    ├── jobs/                     Async generation-job state machine
    │   └── worker                Worker tick (pg_cron target in prod)
    ├── typography/               Re-render Arabic text on a background (HarfBuzz + OpenCV)
    ├── og/                       Satori-powered Open Graph image route
    └── images/overlay            Legacy Pillow overlay endpoint

lib/
├── agents.ts                     Agent registry (model + endpoint env)
├── orchestrator.ts               Streaming pipeline (real fetch + stub fallback)
├── morphology.ts                 Saudi White-Dialect Sarf/Nahw constraint engine
├── vision.ts                     Vision agent (NIM Nemotron Nano Omni)
├── edify.ts                      NVIDIA Edify Image + ControlNet client
├── jobs.ts                       Async job state machine
├── store.ts                      File-backed JSON store for campaigns
├── style.ts                      Adaptive few-shot RAG over brand samples
├── secrets.ts                    Encrypted secret store
├── typography/
│   ├── shape.ts                  HarfBuzz WASM text shaping (with SVG fallback)
│   ├── warp.ts                   Calls scripts/typography_pipeline.py
│   └── types.ts                  Shared typography types
└── supabase/
    ├── server.ts                 Lazy Supabase client loader
    └── types.ts                  Hand-written database types

supabase/
├── config.toml                   Local CLI configuration
└── migrations/
    ├── 0001_init.sql             Tenant tables + jobs + audit log
    ├── 0002_rls.sql              Row Level Security policies
    └── 0003_pg_cron_schedule.sql Worker schedule (commented out by default)

scripts/
├── overlay_arabic.py             Legacy Pillow overlay
├── typography_pipeline.py        OpenCV perspective warp + alpha blend
└── requirements.txt              Python dependencies

components/
├── landing/                      Public marketing UI
└── app/                          Dashboard UI (sidebar, pipeline, etc.)
```

## Agent ↔ model mapping

| Stage | Agent | Model | Env var |
| --- | --- | --- | --- |
| 0 | Vision Analyst | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` | `Api` |
| 1 | Campaign Manager | `nvidia/llama-3.3-nemotron-super-49b-v1` | `Api` |
| 2 | Content Strategist | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` | `Api` |
| 3 | Copywriter | `glm-4.5` (Z.AI) | `Glm` |
| 4 | Data Analyst | DeepSeek-V4-Pro | `DEEPSEEK_API_URL` |
| 5 | Creative Designer | Edify Image 1 (preferred) → FLUX 2 [klein] 4B (fallback) | `Edify` / `Flux` |
| 6 | Social Media Specialist | Qwen3-8B | `QWEN_API_URL` |
| 7 | SEO Expert | Falcon-H1 Arabic 34B | `FALCON_API_URL` |
| 8 | Video Creator | Cosmos-Transfer2.5 | `COSMOS_API_URL` |

## Saudi White-Dialect engine

The morphology engine (`lib/morphology.ts`) injects an Arabic
system-prompt fragment that constrains Sarf (morphology) and Nahw
(syntax) explicitly, banning MSA passive constructions and Egyptian /
Levantine colloquialisms. The fragment is appended to every voice-agent
(`copywriter`, `strategist`, `social`, `seo`) by the orchestrator at run
time. See [`docs/DIALECT.md`](docs/DIALECT.md).

## Editable Arabic typography

Arabic copy is rendered **after** the diffusion step: the diffusion model
generates a clean lifestyle background with a blank label surface, then
`POST /api/typography` warps an HarfBuzz-shaped text canvas onto the
label via OpenCV's `getPerspectiveTransform`. Editing copy is a
sub-second re-render instead of a fresh diffusion call. See
[`docs/TYPOGRAPHY.md`](docs/TYPOGRAPHY.md).

## Compliance

The platform is built to satisfy KSA's **PDPL** plus **SDAIA** / **NDMO**
guidance — data residency, RLS-enforced multi-tenant isolation, audit
logging, and CMEK-style encryption. See
[`docs/COMPLIANCE.md`](docs/COMPLIANCE.md).

## Brand palette

| Token         | Hex       | Usage                                |
| ------------- | --------- | ------------------------------------ |
| `aura-blue`   | `#438FB3` | Primary navigation, buttons, trust   |
| `aura-teal`   | `#58A8B4` | Links, accents, AI activity          |
| `aura-silver` | `#B3B7C1` | Card borders, low-contrast surfaces  |
| `aura-dark`   | `#0F172A` | Text + maximum contrast              |
| `aura-mist`   | `#F4F7FB` | App background                       |

## Scripts

- `npm run dev` — start the development server (Turbopack)
- `npm run build` — produce a production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint
