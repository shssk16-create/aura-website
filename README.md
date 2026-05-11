# AURA AI

Self-hosted Arabic-first SaaS for AI-driven marketing campaigns. A team of
specialised open-weight models — coordinated by a Campaign Manager agent —
write copy in fluent "White Arabic", generate brand visuals with FLUX.1, and
overlay Arabic text with pixel-perfect typography via Pillow + arabic-reshaper.

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind**, and a
streaming Node.js LangChain-style orchestrator. Every request flows through a
secure server-side proxy — API keys never reach the browser.

## Getting started

```bash
npm install
cp .env.example .env.local      # fill in inference endpoints (optional)
npm run dev                     # http://localhost:3000
```

When `*_API_URL` env vars are missing, the orchestrator falls back to
deterministic stub generators so the UI remains fully usable without GPUs.

### Optional Python tooling

The Creative Designer agent overlays Arabic copy on top of FLUX-generated
backgrounds via [`scripts/overlay_arabic.py`](scripts/overlay_arabic.py):

```bash
python -m pip install -r scripts/requirements.txt
python scripts/overlay_arabic.py \
  --image background.png \
  --text "هالتك الفارقة" \
  --output final.png
```

## Architecture

```
app/                     Next.js routes
├── page.tsx             Landing (hero · agents · how it works · pricing)
├── app/                 Dashboard
│   ├── page.tsx         Campaign list
│   ├── campaigns/new    Wizard
│   ├── campaigns/[id]   Live agent pipeline (SSE)
│   ├── agents/          Agent registry
│   └── settings/        Endpoint configuration
└── api/
    ├── campaigns/       CRUD + run (Server-Sent Events stream)
    └── images/overlay   Brand-aware SVG placeholder (swap for Python overlay)

lib/
├── agents.ts            Agent registry (model + endpoint env)
├── orchestrator.ts      Streaming pipeline (real fetch + stub fallback)
└── store.ts             File-backed JSON store for campaigns

components/
├── landing/             Public marketing UI
└── app/                 Dashboard UI (sidebar, pipeline, etc.)

scripts/
├── overlay_arabic.py    Pillow + arabic-reshaper text overlay
└── requirements.txt     Python dependencies
```

## Agent ↔ model mapping

| Agent                | Model                      | Env var            |
| -------------------- | -------------------------- | ------------------ |
| Campaign Manager     | DeepSeek-V4-Pro            | `DEEPSEEK_API_URL` |
| Content Strategist   | Nemotron-3-Nano-Omni       | `NEMOTRON_API_URL` |
| Copywriter           | Jais-2 70B Chat            | `JAIS_API_URL`     |
| Data Analyst         | DeepSeek-V4-Pro            | `DEEPSEEK_API_URL` |
| Creative Designer    | FLUX.1 [pro] + Pillow      | `FLUX_API_URL`     |
| Social Media         | Qwen3-8B                   | `QWEN_API_URL`     |
| SEO Expert           | Falcon-H1 Arabic 34B       | `FALCON_API_URL`   |
| Video Creator        | Cosmos-Transfer2.5         | `COSMOS_API_URL`   |

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
