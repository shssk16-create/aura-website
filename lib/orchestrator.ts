/**
 * Agent orchestrator.
 *
 * In production this would be a LangChain agent graph that hits the real
 * model endpoints declared in `lib/agents.ts`. For v1 we expose the same
 * streaming surface but back it with deterministic stub generators so the
 * UI is fully demoable without GPUs.
 *
 * Swap `streamFromEnv` for a real fetch to your inference cluster once
 * the corresponding `*_API_URL` env var is populated.
 */

import { AGENTS_BY_ID, type AgentId } from "./agents";

export interface AgentChunk {
  agentId: AgentId;
  /** Incremental text chunk produced by the agent. */
  delta: string;
  /** Optional structured artefact produced at the end of the run. */
  artefact?: {
    kind: "image";
    url: string;
  } | {
    kind: "creative";
    headlineAr: string;
    copyAr: string;
    cta: string;
  };
}

export interface OrchestratorInput {
  brand: string;
  goal: string;
  audience: string;
  channel: string;
  tone: string;
}

/**
 * Stream chunks for a single agent. Yields incremental deltas; the consumer
 * is responsible for appending them to the agent run's `output` field.
 */
export async function* runAgent(
  agentId: AgentId,
  input: OrchestratorInput,
): AsyncGenerator<AgentChunk, void, unknown> {
  const agent = AGENTS_BY_ID[agentId];
  const endpoint = process.env[agent.endpointEnv];

  if (endpoint) {
    yield* streamFromEnv(agentId, endpoint, input);
    return;
  }

  // No real endpoint configured — fall back to the stub generator so the UX
  // is still usable. Each stub mimics the pacing of a real LLM stream.
  yield* stubStream(agentId, input);
}

async function* streamFromEnv(
  agentId: AgentId,
  endpoint: string,
  input: OrchestratorInput,
): AsyncGenerator<AgentChunk, void, unknown> {
  // Production hook: POST to the agent's endpoint and stream the response
  // line-by-line. Intentionally guarded so we don't crash in environments
  // where the model isn't actually deployed yet.
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent: agentId, input }),
    });
    if (!res.body) {
      yield { agentId, delta: "(no body returned from inference endpoint)" };
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield { agentId, delta: decoder.decode(value, { stream: true }) };
    }
  } catch (err) {
    yield {
      agentId,
      delta: `[تعذَّر الاتصال بنقطة الاستدلال: ${(err as Error).message}]`,
    };
  }
}

/** Deterministic stub stream. Splits a canned response into small chunks. */
async function* stubStream(
  agentId: AgentId,
  input: OrchestratorInput,
): AsyncGenerator<AgentChunk, void, unknown> {
  const text = canned(agentId, input);
  const tokens = text.match(/\S+\s*|\s+/g) ?? [text];
  for (const tok of tokens) {
    await sleep(35);
    yield { agentId, delta: tok };
  }

  // Final artefacts for specific agents.
  if (agentId === "designer") {
    yield {
      agentId,
      delta: "",
      artefact: {
        kind: "image",
        url: `/api/images/overlay?text=${encodeURIComponent(
          input.brand,
        )}&subtitle=${encodeURIComponent(input.goal)}`,
      },
    };
  }
  if (agentId === "copywriter") {
    yield {
      agentId,
      delta: "",
      artefact: {
        kind: "creative",
        headlineAr: `${input.brand}: ${input.goal}`,
        copyAr: text,
        cta: defaultCta(input.channel),
      },
    };
  }
}

function defaultCta(channel: string): string {
  switch (channel) {
    case "instagram":
      return "اضغط على الرابط في البايو";
    case "x":
      return "تابعنا للمزيد";
    case "tiktok":
      return "اكتشف القصة كاملةً";
    case "linkedin":
      return "تعرَّف على الحل";
    default:
      return "ابدأ الآن";
  }
}

function canned(agentId: AgentId, input: OrchestratorInput): string {
  switch (agentId) {
    case "manager":
      return [
        `استلمتُ مهمَّة الحملة الخاصَّة بعلامة «${input.brand}».`,
        `الهدف المعلن: ${input.goal}. الجمهور: ${input.audience}. القناة: ${input.channel}.`,
        "سأقسِّم العمل على الفريق: خبير المحتوى يدرس المنافسين، كاتب الإعلانات يصوغ النسخة، المصمِّم يجهِّز الصورة، ثم نسلِّم للسوشيال.",
      ].join(" ");
    case "strategist":
      return [
        `حلَّلتُ ٢٠ منشورًا متشابهًا في فئة ${input.brand}.`,
        "الزاوية الأقوى: قصَّة عميل حقيقي + رقم لافت + دعوة فعل واضحة.",
        "أوصي بنبرة هادئة واثقة، وصورة بصرية واحدة كثيفة بدل عدَّة عناصر متناثرة.",
      ].join(" ");
    case "copywriter":
      return [
        `عنوان مقترح: «${input.goal} بأسلوب ${input.brand}».`,
        "نسخة الجسم: نختصر لك القرار في خطوتين، نعرض النتيجة قبل التفاصيل، ونترك المساحة للقارئ ليقول نعم.",
        "النبرة بيضاء، خالية من الترجمة الحرفية، ومناسبة للقنوات المؤسسية والاجتماعية معًا.",
      ].join(" ");
    case "analyst":
      return [
        "قاعدة البيانات التاريخية تشير إلى أن الإعلانات بنبرة هادئة تحقِّق معدَّل تفاعل أعلى بنسبة ٢٣٪.",
        "الفئة العمرية ٢٥-٣٤ هي الأعلى استجابة، وأفضل توقيت للنشر هو الثلاثاء مساءً.",
      ].join(" ");
    case "designer":
      return [
        "ولَّدتُ خلفية بـ FLUX.1 بمساحة سالبة واضحة على اليسار.",
        "سأمرِّر النص العربي إلى سكربت Pillow + arabic-reshaper لطباعته بدقَّة طباعية كاملة على الصورة.",
      ].join(" ");
    case "social":
      return [
        `منشور إنستغرام: ${input.brand} — ${input.goal}. اقرأ القصَّة كاملةً في البايو.`,
        `تغريدة: ${input.brand} يقدِّم حلًّا واحدًا، لا عشرة. نَصُّ مقتضب وموجَّه ل${input.audience}.`,
      ].join(" ");
    case "seo":
      return [
        "الكلمات المفتاحية المقترحة: حلول مؤسَّسية، خدمة عملاء عربية، أتمتة التسويق.",
        "حجم البحث الشهري التقديري: ٤٫٢ ألف، والمنافسة متوسِّطة.",
      ].join(" ");
    case "video":
      return [
        "أنتجتُ مونتاجًا قصيرًا مدَّته ١٥ ثانية انطلاقًا من الصورة الثابتة، مع موسيقى توقيعية هادئة وحركة كاميرا بطيئة.",
      ].join(" ");
    default:
      return "تم.";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
