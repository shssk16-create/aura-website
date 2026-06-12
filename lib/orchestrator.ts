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

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  type AgentDefinition,
  type AgentId,
  type ImageInferenceConfig,
  type ImageProviderId,
  type InferenceConfig,
  type ProviderId,
} from "./agents";
import { getAgentById } from "./registry";
import { getKey } from "./secrets";
import {
  appliesTo as morphologyAppliesTo,
  buildMorphologyFragment,
  type DialectTone,
} from "./morphology";
import {
  formatSamplesAsFewShot,
  pickSamplesForCampaign,
  type StyleSample,
} from "./style";

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
  const agent = await getAgentById(agentId);
  if (!agent) {
    yield { agentId, delta: `(unknown agent: ${agentId})` };
    return;
  }
  if (agent.disabled) {
    yield { agentId, delta: `(الوكيل معطّل)` };
    return;
  }

  // Style memory — top-3 brand-voice samples for this agent. Injected into
  // the user prompt as worked examples for live runs (no-op on stub path).
  const samples = await pickSamplesForCampaign({
    brand: input.brand,
    channel: input.channel,
    tone: input.tone,
    agent: agentId,
  });

  // 1a. Live image-generation path (FLUX et al). The agent yields a short
  // narration while the diffusion call is in flight, then emits an `image`
  // artefact pointing at the saved file.
  if (agent.imageInference) {
    const key = await resolveKeyByProvider(
      agent.imageInference.provider,
      agent.imageInference.keyEnv,
    );
    if (key) {
      const fluxPrompt = buildImagePrompt(input);
      const narration = [
        "أبني موجِّهًا بصريًا بالإنجليزية يحترم نبرة العلامة وقناة النشر، مع مساحة سلبية على اليمين للنص العربي.\n\n",
        `» ${fluxPrompt}\n\n`,
        `جارٍ توليد الخلفية عبر ${agent.imageInference.model}…\n`,
      ];
      for (const part of narration) {
        for (const tok of part.match(/\S+\s*|\s+/g) ?? [part]) {
          await sleep(25);
          yield { agentId, delta: tok };
        }
      }
      try {
        const imageUrl = await generateImage(
          agent.imageInference,
          key,
          fluxPrompt,
        );
        const done = "اكتملت الخلفية. ستوضع طبقة النص العربي عبر سكربت بايثون (arabic-reshaper + python-bidi).";
        yield { agentId, delta: done };
        yield {
          agentId,
          delta: "",
          artefact: { kind: "image", url: imageUrl },
        };
        return;
      } catch (err) {
        const tail = `\n[تعذَّر توليد الصورة عبر ${agent.imageInference.provider}: ${(err as Error).message}]`;
        yield { agentId, delta: tail };
        // Fall through to text/stub backends so the UI still gets an artefact.
      }
    }
  }

  // Compose the system prompt: per-agent role prompt + (if applicable) the
  // Saudi-dialect morphology fragment. The fragment is rule-based and Arabic-
  // first; combined with the few-shot RAG it raises dialect fidelity from a
  // 47% MSA baseline to ~84% (see docs/DIALECT.md).
  const composedSystemPrompt = composeSystemPrompt(
    agent.id,
    agent.systemPromptAr,
    input.tone,
  );

  // 1. Live (text) inference path
  if (agent.inference) {
    const key = await resolveKey(agent.inference);
    if (key) {
      let liveContent = "";
      let liveOk = false;
      try {
        for await (const delta of streamChat(
          agent.inference,
          key,
          composedSystemPrompt,
          input,
          samples,
        )) {
          if (delta) {
            liveContent += delta;
            yield { agentId, delta };
          }
        }
        liveOk = liveContent.trim().length > 0;
      } catch (err) {
        // Surface a short tail message only if we already streamed visible
        // content (so the user knows their stream was truncated). When the
        // call fails before producing anything, stay silent so the fallback
        // path can emit clean output without our error message bleeding into
        // the persisted artefact.
        if (liveContent.trim().length > 0) {
          const tail = `\n[انقطع البث: ${(err as Error).message}]`;
          liveContent += tail;
          yield { agentId, delta: tail };
          liveOk = true;
        } else {
          console.warn(
            `[orchestrator] ${agent.inference.provider} call failed:`,
            (err as Error).message,
          );
        }
      }
      if (liveOk) {
        yield* finalArtefact(agentId, input, liveContent);
        return;
      }
      // No live content — fall through to the next backend.
    }
  }

  // 2. Custom endpoint path. Accumulate the streamed body so the final
  // creative/image artefact reflects the real model output, not the stub.
  const endpoint = process.env[agent.endpointEnv];
  if (endpoint) {
    let liveContent = "";
    for await (const chunk of streamFromEndpoint(
      agentId,
      endpoint,
      composedSystemPrompt,
      input,
    )) {
      if (chunk.delta) liveContent += chunk.delta;
      yield chunk;
    }
    const body =
      liveContent.trim().length > 0 ? liveContent : stubCanned(agentId, input);
    yield* finalArtefact(agentId, input, body);
    return;
  }

  // 3. Stub fallback
  yield* stubStream(agentId, input);
}

/**
 * Read and sanitise the API key. Tolerates secrets that were pasted with
 * TOML/JSON-style wrapping such as `api_key = "..."`.
 */
async function resolveKey(cfg: InferenceConfig): Promise<string | undefined> {
  return resolveKeyByProvider(cfg.provider, cfg.keyEnv);
}

async function resolveKeyByProvider(
  provider: ProviderId | ImageProviderId,
  keyEnv: string,
): Promise<string | undefined> {
  // Prefer the encrypted store (UI-managed); fall back to env vars so
  // existing env-only deploys keep working transparently.
  const raw = (await getKey(keyEnv)) ?? process.env[keyEnv];
  if (!raw) return undefined;

  // NVIDIA keys always look like `nvapi-<token>`; pull that substring out
  // even when the value is wrapped (toml/json-style).
  if (provider === "nvidia" || provider === "nvidia-image") {
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
  samples: StyleSample[] = [],
): AsyncGenerator<string, void, unknown> {
  const userPrompt = buildUserPrompt(input, samples);
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
      // Reasoning models (Nemotron-Nano-Omni, GLM thinking, etc.) burn most
      // of their budget on `reasoning_content` before emitting any visible
      // `content`. Give them ~4× the head-room of plain chat models so the
      // final answer survives the orchestrator's `reasoning_content` filter.
      max_tokens: cfg.reasoning ? 4096 : 1024,
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

/**
 * Build an English diffusion prompt from the Arabic brief. FLUX (and most
 * text-to-image models) understand English best, so we map the Arabic
 * tone/channel hints to English keywords deterministically.
 */
function buildImagePrompt(input: OrchestratorInput): string {
  const toneEn: Record<string, string> = {
    corporate: "premium corporate, restrained editorial color palette",
    youthful: "vibrant youthful, bold accent colors, energetic mood",
    luxury: "luxurious, soft golden lighting, refined minimalism",
    playful: "playful, expressive shapes, joyful palette",
  };
  const channelEn: Record<string, string> = {
    instagram: "Instagram-ready 1:1 hero composition",
    x: "X/Twitter banner composition",
    tiktok: "TikTok 9:16-aware composition",
    linkedin: "LinkedIn corporate composition",
    web: "web hero banner composition",
  };
  return [
    `Premium advertising background image for the brand "${input.brand}".`,
    `Style: ${toneEn[input.tone] ?? "clean modern editorial"}.`,
    `Layout: ${channelEn[input.channel] ?? "flexible hero composition"}.`,
    `Generous empty negative space on the right side for Arabic text overlay.`,
    `Soft cinematic lighting, photorealistic, ultra-detailed, 4k, no text, no logos, no watermarks.`,
  ].join(" ");
}

/**
 * Call NVIDIA NIM's FLUX-style image-generation endpoint and persist the
 * resulting JPEG to `.data/images/<uuid>.jpg`. Returns the public URL the
 * front-end should load.
 */
async function generateImage(
  cfg: ImageInferenceConfig,
  apiKey: string,
  prompt: string,
): Promise<string> {
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      steps: cfg.steps,
      seed: Math.floor(Math.random() * 1_000_000),
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `${cfg.provider} ${res.status}: ${text.slice(0, 300)}`,
    );
  }
  const json = (await res.json()) as {
    artifacts?: Array<{ base64?: string; mime_type?: string }>;
    image?: string;
  };
  const artefact = json.artifacts?.[0];
  const b64 = artefact?.base64 ?? json.image;
  if (!b64) throw new Error(`${cfg.provider}: empty image payload`);

  // FLUX returns image/jpeg by default; honour the mime_type hint when given.
  const ext = artefact?.mime_type?.endsWith("png") ? "png" : "jpg";
  const dataDir = process.env.AURA_DATA_DIR ?? path.join(process.cwd(), ".data");
  const imagesDir = path.join(dataDir, "images");
  await fs.mkdir(imagesDir, { recursive: true });
  const filename = `${crypto.randomUUID()}.${ext}`;
  await fs.writeFile(path.join(imagesDir, filename), Buffer.from(b64, "base64"));
  return `/api/images/file/${filename}`;
}

/**
 * Compose the final system prompt: the agent's role prompt plus the
 * morphology fragment when the agent speaks in voice (copywriter,
 * strategist, social, seo). Other agents — manager, designer, analyst,
 * video — receive their role prompt unchanged.
 */
function composeSystemPrompt(
  agentId: AgentId,
  rolePrompt: string | undefined,
  tone: string,
): string | undefined {
  if (!morphologyAppliesTo(agentId)) return rolePrompt;
  const fragment = buildMorphologyFragment({ tone: tone as DialectTone });
  if (!rolePrompt) return fragment;
  return `${rolePrompt}\n\n${fragment}`;
}

function buildUserPrompt(
  input: OrchestratorInput,
  samples: StyleSample[] = [],
): string {
  const fewShot = formatSamplesAsFewShot(samples);
  return [
    fewShot,
    "هذه بيانات الحملة:",
    `- العلامة: ${input.brand}`,
    `- الهدف: ${input.goal}`,
    `- الجمهور: ${input.audience}`,
    `- القناة: ${input.channel}`,
    `- النبرة: ${input.tone}`,
    "",
    "اكتب جوابك مباشرةً بلغة عربية بيضاء فصيحة، بدون مقدِّمات أو تعليقات عن المهمَّة نفسها.",
  ]
    .filter((s) => s.length > 0)
    .join("\n");
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
  // Prefer a clean split on the first newline.
  const firstNewline = trimmed.indexOf("\n");
  if (firstNewline !== -1) {
    return {
      headline: trimmed.slice(0, firstNewline).trim().slice(0, 120),
      body: trimmed.slice(firstNewline + 1).trim(),
    };
  }
  // Single-line output: split on the first sentence boundary so the headline
  // and body stay distinct instead of duplicating the full text twice.
  const boundary = trimmed.search(/[.!?؟،]\s|[.!?؟،]$/);
  if (boundary !== -1 && boundary < trimmed.length - 1) {
    const cut = boundary + 1;
    const head = trimmed.slice(0, cut).trim();
    const body = trimmed.slice(cut).trim();
    if (head && body) {
      return { headline: head.slice(0, 120), body };
    }
  }
  // No usable boundary — derive a brand/goal headline so the UI does not
  // render the same text twice.
  return {
    headline: `${input.brand}: ${input.goal}`.slice(0, 120),
    body: trimmed,
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
    default:
      // Custom agent without a live key: produce a neutral, brief Arabic
      // placeholder so the pipeline never stalls on a missing model.
      return [
        `وكيل «${agentId}» يعمل في الوضع التجريبي.`,
        `الإدخال: علامة ${input.brand}، الهدف ${input.goal}، الجمهور ${input.audience}، القناة ${input.channel}.`,
      ].join(" ");
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Re-export for callers that want to inspect agent metadata alongside the
// orchestrator API.
export type { AgentDefinition };
