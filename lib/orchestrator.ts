/**
 * Agent orchestrator.
 *
 * Streams a single agent's output through the same interface regardless of
 * which inference backend is wired up:
 *
 *   1. If the agent declares `nvidiaModel` and an NVIDIA API key is in the
 *      env, call `https://integrate.api.nvidia.com/v1/chat/completions`
 *      with `Authorization: Bearer <key>` and parse OpenAI SSE chunks.
 *   2. Else if `endpointEnv` is populated, POST to that custom endpoint and
 *      pipe the raw response body through.
 *   3. Otherwise fall back to a deterministic stub so the UI is demoable
 *      without GPUs.
 *
 * The function is an async generator yielding `AgentChunk` records — callers
 * forward each chunk as a Server-Sent Event to the browser.
 */

import { AGENTS_BY_ID, type AgentId } from "./agents";

export interface AgentChunk {
  agentId: AgentId;
  /** Incremental text chunk produced by the agent. */
  delta: string;
  /** Optional structured artefact produced at the end of the run. */
  artefact?:
    | {
        kind: "image";
        url: string;
      }
    | {
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

const NIM_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

/**
 * Stream chunks for a single agent. Yields incremental deltas; the consumer
 * is responsible for appending them to the agent run's `output` field.
 */
export async function* runAgent(
  agentId: AgentId,
  input: OrchestratorInput,
): AsyncGenerator<AgentChunk, void, unknown> {
  const agent = AGENTS_BY_ID[agentId];

  // 1. NVIDIA NIM path
  if (agent.nvidiaModel) {
    const key = resolveNvidiaKey(agent.nvidiaKeyEnv);
    if (key) {
      let producedText = false;
      try {
        for await (const delta of streamNim(agent.nvidiaModel, key, agent.systemPromptAr, input)) {
          if (delta) {
            producedText = true;
            yield { agentId, delta };
          }
        }
      } catch (err) {
        yield {
          agentId,
          delta: `\n[تعذَّر الاتصال بـ NVIDIA NIM: ${(err as Error).message}]`,
        };
      }
      if (producedText) {
        yield* finalArtefact(agentId, input, stubCanned(agentId, input));
        return;
      }
      // If NIM produced no text we fall through to the stub.
    }
  }

  // 2. Custom endpoint path
  const endpoint = process.env[agent.endpointEnv];
  if (endpoint) {
    yield* streamFromEndpoint(agentId, endpoint, agent.systemPromptAr, input);
    yield* finalArtefact(agentId, input, stubCanned(agentId, input));
    return;
  }

  // 3. Stub fallback
  yield* stubStream(agentId, input);
}

function resolveNvidiaKey(envName?: string): string | undefined {
  const raw =
    (envName ? process.env[envName] : undefined) ??
    process.env.NVIDIA_API_KEY ??
    process.env.NEMOTRON_API_KEY ??
    process.env.Api;
  if (!raw) return undefined;
  // Allow the secret to be stored as `nvapi-...` raw, or wrapped in a
  // TOML / JSON-style assignment like `api_key = "nvapi-..."`.
  const match = raw.match(/nvapi-[A-Za-z0-9_-]+/);
  return (match ? match[0] : raw).trim();
}

/**
 * Hit NVIDIA NIM's OpenAI-compatible chat completions endpoint with streaming
 * enabled and yield each token delta.
 */
async function* streamNim(
  model: string,
  apiKey: string,
  systemPrompt: string | undefined,
  input: OrchestratorInput,
): AsyncGenerator<string, void, unknown> {
  const userPrompt = buildUserPrompt(input);
  const res = await fetch(NIM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      temperature: 0.6,
      top_p: 0.95,
      // High enough budget for reasoning models (Nemotron Nano Omni) to
      // finish their reasoning *and* emit a final answer.
      max_tokens: 1024,
      messages: [
        ...(systemPrompt
          ? [{ role: "system", content: systemPrompt }]
          : []),
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`NIM ${res.status}: ${text.slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload) as {
          choices?: {
            delta?: { content?: string; reasoning_content?: string };
          }[];
        };
        // We surface visible content. Reasoning content (Nemotron Nano Omni)
        // is intentionally suppressed so the UI shows only the final answer.
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // Ignore malformed SSE lines (heartbeats, etc.)
      }
    }
  }
}

async function* streamFromEndpoint(
  agentId: AgentId,
  endpoint: string,
  systemPrompt: string | undefined,
  input: OrchestratorInput,
): AsyncGenerator<AgentChunk, void, unknown> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent: agentId, system: systemPrompt, input }),
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

function buildUserPrompt(input: OrchestratorInput): string {
  return [
    "هذه بيانات الحملة:",
    `- العلامة: ${input.brand}`,
    `- الهدف: ${input.goal}`,
    `- الجمهور: ${input.audience}`,
    `- القناة: ${input.channel}`,
    `- النبرة: ${input.tone}`,
    "",
    "اكتب جوابك مباشرةً بلغة عربية بيضاء فصيحة، بدون مقدِّمات أو تعليقات عن المهمَّة نفسها.",
  ].join("\n");
}

/** Deterministic stub stream. Splits a canned response into small chunks. */
async function* stubStream(
  agentId: AgentId,
  input: OrchestratorInput,
): AsyncGenerator<AgentChunk, void, unknown> {
  const text = stubCanned(agentId, input);
  const tokens = text.match(/\S+\s*|\s+/g) ?? [text];
  for (const tok of tokens) {
    await sleep(35);
    yield { agentId, delta: tok };
  }
  yield* finalArtefact(agentId, input, text);
}

/** Emit the final structured artefact for the agents that produce one. */
async function* finalArtefact(
  agentId: AgentId,
  input: OrchestratorInput,
  copyBody: string,
): AsyncGenerator<AgentChunk, void, unknown> {
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
        copyAr: copyBody,
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

function stubCanned(agentId: AgentId, input: OrchestratorInput): string {
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
        "بناءً على الجمهور والقناة، أتوقَّع معدَّل تفاعل أوَّلي بين ٢.٨٪ و ٤.٢٪.",
        "أوصي بتجربة عنوانين متوازيين خلال الـ ٤٨ ساعة الأولى وقياس النسبة قبل الصرف الكامل.",
      ].join(" ");
    case "designer":
      return [
        "تمَّ توليد خلفية بألوان العلامة، مع مساحة سلبية يمنى للنص.",
        "سأمرِّر الصورة لسكربت بايثون ليضع العنوان والنسخة بحروف موصولة وبترتيب صحيح.",
      ].join(" ");
    case "social":
      return [
        `إصدار سوشيال جاهز للنشر على ${input.channel}:`,
        "«حلٌّ واحد. خطوتان. والباقي علينا.» — مع وسم العلامة وثلاث وسوم سياقية.",
      ].join(" ");
    case "seo":
      return [
        "اقترحتُ ٥ كلمات مفتاحية عربية بحجم بحث عالٍ ومنافسة متوسطة:",
        `${input.brand}، ${input.goal}، حلول ${input.audience}، أدوات تسويق، حملات إعلانية.`,
      ].join(" ");
    case "video":
      return [
        "أعددتُ ستوريبورد من ٦ لقطات: مشهد افتتاحي بصري، إشكال، حلٌّ، شهادة عميل، دعوة فعل، شعار.",
      ].join(" ");
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
