/**
 * Agent orchestrator.
 *
 * Streams a single agent's output through one of three backends, in order:
 *
 *   1. The agent's `inference` block — any OpenAI-compatible chat completions
 *      endpoint (NVIDIA NIM, Z.AI / GLM, OpenAI, vLLM, etc.) provided the
 *      env var named by `inference.keyEnv` is set.
 *   2. A custom URL stored in `process.env[agent.endpointEnv]` (legacy hook).
 *   3. A deterministic stub stream so the UI is fully demoable without GPUs.
 *
 * The function is an async generator yielding `AgentChunk` records — callers
 * forward each chunk as a Server-Sent Event to the browser.
 */

import {
  AGENTS_BY_ID,
  type AgentDefinition,
  type AgentId,
  type InferenceConfig,
} from "./agents";

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

/**
 * Stream chunks for a single agent. Yields incremental deltas; the consumer
 * is responsible for appending them to the agent run's `output` field.
 */
export async function* runAgent(
  agentId: AgentId,
  input: OrchestratorInput,
): AsyncGenerator<AgentChunk, void, unknown> {
  const agent = AGENTS_BY_ID[agentId];

  // 1. Live inference path
  if (agent.inference) {
    const key = resolveKey(agent.inference);
    if (key) {
      let liveContent = "";
      try {
        for await (const delta of streamChat(
          agent.inference,
          key,
          agent.systemPromptAr,
          input,
        )) {
          if (delta) {
            liveContent += delta;
            yield { agentId, delta };
          }
        }
      } catch (err) {
        yield {
          agentId,
          delta: `\n[تعذَّر الاتصال بمزوِّد ${agent.inference.provider}: ${(err as Error).message}]`,
        };
      }
      if (liveContent.trim().length > 0) {
        yield* finalArtefact(agentId, input, liveContent);
        return;
      }
      // If the live call produced no text, fall through to the stub so the
      // UI still gets something to render.
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

/**
 * Read and sanitise the API key. Tolerates secrets that were pasted with
 * TOML/JSON-style wrapping such as `api_key = "..."`.
 */
function resolveKey(cfg: InferenceConfig): string | undefined {
  const raw = process.env[cfg.keyEnv];
  if (!raw) return undefined;

  // NVIDIA keys always look like `nvapi-<token>`; pull that substring out
  // even when the value is wrapped.
  if (cfg.provider === "nvidia") {
    const m = raw.match(/nvapi-[A-Za-z0-9_-]+/);
    if (m) return m[0];
  }

  // For everything else, if the value contains a quoted segment, prefer it.
  const quoted = raw.match(/"([^"\r\n]+)"/);
  if (quoted) return quoted[1].trim();

  return raw.trim();
}

/**
 * Hit an OpenAI-compatible chat completions endpoint with streaming enabled
 * and yield each visible content delta.
 */
async function* streamChat(
  cfg: InferenceConfig,
  apiKey: string,
  systemPrompt: string | undefined,
  input: OrchestratorInput,
): AsyncGenerator<string, void, unknown> {
  const userPrompt = buildUserPrompt(input);
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: cfg.model,
      stream: true,
      temperature: 0.6,
      top_p: 0.95,
      // Wide enough for reasoning models to think *and* produce final text.
      max_tokens: 1024,
      messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`${cfg.provider} ${res.status}: ${text.slice(0, 300)}`);
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
        // Always surface visible content. `reasoning_content` (Nemotron
        // Nano Omni, GLM thinking mode) is intentionally suppressed so the
        // UI shows only the final answer.
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // Heartbeats / malformed SSE lines.
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
    const { headline, body } = splitHeadlineAndBody(copyBody, input);
    yield {
      agentId,
      delta: "",
      artefact: {
        kind: "creative",
        headlineAr: headline,
        copyAr: body,
        cta: defaultCta(input.channel),
      },
    };
  }
}

/**
 * Pull a one-line headline + remaining body from the agent's text. Falls
 * back to a brand/goal headline if the model didn't produce a clear first
 * line.
 */
function splitHeadlineAndBody(
  text: string,
  input: OrchestratorInput,
): { headline: string; body: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { headline: `${input.brand}: ${input.goal}`, body: trimmed };
  }
  const firstNewline = trimmed.indexOf("\n");
  if (firstNewline === -1) {
    return { headline: trimmed.slice(0, 80), body: trimmed };
  }
  return {
    headline: trimmed.slice(0, firstNewline).trim().slice(0, 120),
    body: trimmed.slice(firstNewline + 1).trim(),
  };
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

// Re-export for callers that want to inspect agent metadata alongside the
// orchestrator API.
export type { AgentDefinition };
