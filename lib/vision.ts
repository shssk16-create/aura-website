/**
 * Vision agent — extracts structured product metadata from a raw photo.
 *
 * @scaffold — the live path posts to NVIDIA NIM
 * (`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`) which accepts a
 * multimodal user message with `image_url`. When the API key is unset, the
 * function returns a deterministic placeholder so the worker pipeline keeps
 * moving.
 *
 * Output shape matches `VisionMetadata` in `lib/supabase/types.ts`.
 */

import type { LabelSurface, VisionMetadata } from "./supabase/types";
import { getKey } from "./secrets";

export interface VisionRequest {
  /** Public or signed URL pointing at the raw product photo. */
  imageUrl: string;
  /** Optional hint provided by the merchant (e.g. "perfume bottle"). */
  hint?: string;
}

const ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning";
const KEY_ENV = "Api";

const SYSTEM_PROMPT_AR = [
  "أنت «وكيل الرؤية» في أورا.",
  "حلِّل صورة المنتج وأخرِج JSON صارمًا بالحقول التالية:",
  "  description: وصف موجز بالعربية البيضاء (سطران كحدّ أقصى).",
  "  dominant_colors: مصفوفة ٣ ألوان hex.",
  "  materials: مصفوفة موادّ مرئية (مثل: زجاج معتم، خشب، معدن مفروش).",
  "  label_surfaces: مصفوفة كائنات {label, polygon}؛ polygon أربع نقاط (x,y)",
  "    داخل [0,1] تمثِّل ركون السطح الذي يصلح لطباعة النصّ.",
  "  cultural_context_hints: مصفوفة اقتراحات لمشهد سياقي سعودي (مجلس،",
  "    خيمة، رحلة برّ، استديو، طاولة قهوة…).",
  "ممنوع الزخرفة، أعد JSON خالصًا بلا أيّ نصّ خارج {}.",
].join("\n");

const STUB: VisionMetadata = {
  description:
    "منتج فاخر بسطح مستوٍ يصلح لطباعة شعار أو شعار العلامة. ألوان داكنة هادئة.",
  dominant_colors: ["#1a1a1a", "#c8a45d", "#f4f7fb"],
  materials: ["زجاج معتم", "مَعدن مَفروش"],
  label_surfaces: [
    {
      label: "front",
      polygon: [
        [0.32, 0.38],
        [0.68, 0.38],
        [0.68, 0.62],
        [0.32, 0.62],
      ],
    },
  ],
  cultural_context_hints: [
    "طاولة قهوة في مجلس عصري",
    "ضوء طبيعي خفيف عند المغرب",
    "خلفية ترابيّة فاتحة",
  ],
};

/**
 * Run the vision agent. Falls back to a deterministic stub when the
 * NVIDIA key is missing or the call fails.
 */
export async function analyseProduct(
  req: VisionRequest,
): Promise<VisionMetadata> {
  const key = (await getKey(KEY_ENV)) ?? process.env[KEY_ENV];
  if (!key) return STUB;

  const userMessage = [
    { type: "text", text: req.hint ?? "حلِّل المنتج وأعد JSON." },
    { type: "image_url", image_url: { url: req.imageUrl } },
  ];

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sanitiseKey(key)}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: 1024,
        messages: [
          { role: "system", content: SYSTEM_PROMPT_AR },
          { role: "user", content: userMessage },
        ],
      }),
    });
    if (!res.ok) {
      return STUB;
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    return parseVisionPayload(content) ?? STUB;
  } catch {
    return STUB;
  }
}

function sanitiseKey(raw: string): string {
  const m = raw.match(/nvapi-[A-Za-z0-9_-]+/);
  if (m) return m[0];
  return raw.trim();
}

function parseVisionPayload(content: string): VisionMetadata | null {
  // The model may wrap the JSON in ```json``` fences. Strip those before
  // attempting to parse.
  const cleaned = content
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();
  try {
    const parsed = JSON.parse(cleaned) as Partial<VisionMetadata>;
    if (
      typeof parsed.description !== "string" ||
      !Array.isArray(parsed.dominant_colors) ||
      !Array.isArray(parsed.label_surfaces)
    ) {
      return null;
    }
    return {
      description: parsed.description,
      dominant_colors: parsed.dominant_colors.filter(
        (c): c is string => typeof c === "string",
      ),
      materials: (parsed.materials ?? []).filter(
        (m): m is string => typeof m === "string",
      ),
      label_surfaces: parsed.label_surfaces.filter(isLabelSurface),
      cultural_context_hints: (parsed.cultural_context_hints ?? []).filter(
        (c): c is string => typeof c === "string",
      ),
    };
  } catch {
    return null;
  }
}

function isLabelSurface(value: unknown): value is LabelSurface {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.label !== "string") return false;
  if (!Array.isArray(v.polygon) || v.polygon.length !== 4) return false;
  return v.polygon.every(
    (point) =>
      Array.isArray(point) &&
      point.length === 2 &&
      typeof point[0] === "number" &&
      typeof point[1] === "number",
  );
}
