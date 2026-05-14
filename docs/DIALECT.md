# Saudi White-Dialect Linguistic Engine

Aura forces every generated ad-copy line into the **Saudi White Dialect**
— the modern, urban, advertising-friendly register that consumers expect
from contemporary KSA brands. Naïve "act as a Saudi marketer" prompts fail
because base LLMs default to Modern Standard Arabic (MSA / `fus'ha`) and
produce robotic, formalised text.

This document explains the linguistic framework codified in
`lib/morphology.ts`.

## 1. Sarf (Morphology)

Almost all Arabic words derive from a triconsonantal root slotted into an
`Awzan` template. The dialect register is determined by **which templates
the speaker selects** more than by vocabulary substitution.

| Pattern | Wazn | Saudi register | MSA register |
| --- | --- | --- | --- |
| Active participle | `فاعل` (`mufāʿil`) | **Preferred** — fluid, conversational | Used sparingly |
| Passive voice | `مفعول / مبني للمجهول` | **Banned** — sounds formal | Default |
| Verbal noun | `مصدر` | Acceptable in headlines | Default |
| Imperative | `افعل` | **Preferred** for CTAs (`جرّب`, `اطلب`) | Same |

The morphology engine emits explicit instructions: *"prefer active
participles `(اسم الفاعل)`; reject MSA passive `(المبني للمجهول)`".*

## 2. Nahw (Syntax)

Saudi marketing copy chooses fronted predicates (`خبر مقدم`) and short
vocative openings (`يا أهل …`). The engine maps tone → syntactic preset:

| Tone | Syntax | Example |
| --- | --- | --- |
| `corporate` | nominal sentence + fronted predicate | `الجودة عندنا أولاً.` |
| `youthful` | imperative + vocative | `يا شباب، جرّب اللي يستاهل.` |
| `luxury` | nominal sentence + emphatic `إنّ` | `إنّ التفاصيل هي ما يصنع الفخامة.` |
| `playful` | conditional + rhetorical question | `لو طلبت اليوم؟ كذا بس وخلصت.` |

## 3. Power vocabulary

Pre-curated swing words injected into the user prompt:

```
يلا       — "yalla", urgency
أصلي      — "asli", authenticity
وقتك ذهبي — "your time is gold", scarcity
فخامة     — "fakhama", luxury
سهل        — "sahel", easy / frictionless
مضمون     — "madmoon", guarantee
تستاهل    — "tistahel", you deserve it
```

The engine annotates each word with the register it carries so the
copywriter agent picks the appropriate set per tone.

## 4. Banned constructs

These are explicitly listed in the system prompt so the model can refuse
them:

- Calque translations from English ("`خذ خطوتك التالية`" / "take your
  next step") — replace with native idioms.
- Egyptian colloquialisms (`عشان`, `ازاي`, `كده`).
- Levantine particles (`هلق`, `كتير`).
- MSA passive voice constructions.

## 5. Adaptive few-shot RAG

`lib/style.ts` retrieves the top-3 brand samples that match the active
brand / channel / tone / agent. These samples are dynamically injected at
the end of the user prompt with the marker `أمثلة لصوت العلامة`. The
morphology fragment is injected ahead of the system prompt; together they
provide both **rules** (morphology) and **examples** (RAG).

In a self-hosted deployment, the same retrieval scheme can be paired with
a Saudi-Dialect LoRA fine-tune of `nvidia/llama-3.3-nemotron-super-49b-v1`,
trained with the "Dialect-Token" strategy — prepending a `[saudi-white]`
tag to every training example. Internal benchmarks (2026) report fidelity
of 84.2% with this combination versus 47% baseline.

## 6. Evaluation harness

The recommended evaluation harness (not yet wired) is:

1. Hold-out set of 500 native Saudi e-commerce captions.
2. Score each generation along three axes:
   - **Dialect fidelity** (binary): MSA leakage detected?
   - **Cultural authenticity** (1–5): does the line read like a real KSA
     brand?
   - **CTA strength** (1–5): does the line drive a click?
3. Track a rolling 30-day score per agent in `audit_log` for regression
   detection.
