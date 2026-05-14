/**
 * NVIDIA Edify Image client with ControlNet reference-image anchoring.
 *
 * @scaffold — Edify Image is the preferred diffusion backbone for Aura
 * because it supports ControlNet inputs (Depth + Reference-Image). The
 * merchant's raw photo is passed as the reference anchor so the generated
 * scene preserves product geometry exactly (no "product drift"). The text
 * prompt is appended with an instruction to render a clean blank label
 * surface — Arabic copy is then warped onto that surface programmatically.
 *
 * When `EDIFY_API_URL` + `Edify` (the NVIDIA NIM key) are unset, the
 * orchestrator falls back to the existing FLUX path in
 * `lib/orchestrator.ts`.
 */

import { getKey } from "./secrets";

export type EdifyControlMode = "reference" | "depth" | "sketch";

export interface EdifyRequest {
  /** Free-form English prompt describing the desired lifestyle scene. */
  prompt: string;
  /**
   * Raw product image as a `data:image/...;base64,` URI or HTTP URL. Used
   * as the ControlNet reference anchor.
   */
  referenceImage: string;
  /** Reference-strength (0..1). Higher = stricter product preservation. */
  referenceStrength?: number;
  /** Output resolution. Defaults to 2048×2048 for KSA e-commerce hero use. */
  width?: number;
  height?: number;
  /** Diffusion steps. 30 is the Edify sweet spot. */
  steps?: number;
  /** Optional negative prompt. */
  negativePrompt?: string;
  controlMode?: EdifyControlMode;
}

export interface EdifyResponse {
  /** Final image as a `data:image/png;base64,` URI. */
  imageDataUri: string;
}

const DEFAULT_URL =
  "https://integrate.api.nvidia.com/v1/genai/nvidia/edify-image-1";
const KEY_ENV = "Edify";
const URL_ENV = "EDIFY_API_URL";

/**
 * Generate a lifestyle scene around the merchant's product. Returns
 * `null` when Edify is not configured — callers should fall back to
 * FLUX (unanchored) in that case.
 */
export async function generateLifestyleScene(
  req: EdifyRequest,
): Promise<EdifyResponse | null> {
  const url = process.env[URL_ENV] ?? DEFAULT_URL;
  const key = (await getKey(KEY_ENV)) ?? process.env[KEY_ENV];
  if (!key) return null;

  const body = {
    model: "nvidia/edify-image-1",
    prompt: appendBlankLabelInstruction(req.prompt),
    negative_prompt:
      req.negativePrompt ??
      "text, words, letters, logos, watermark, low quality, distorted product",
    reference_image: req.referenceImage,
    reference_strength: req.referenceStrength ?? 0.85,
    control_mode: req.controlMode ?? "reference",
    width: req.width ?? 2048,
    height: req.height ?? 2048,
    steps: req.steps ?? 30,
    output_format: "png",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sanitiseKey(key)}`,
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as
      | { image?: string }
      | { artifacts?: { base64?: string }[] };
    let base64: string | undefined;
    if ("image" in json && typeof json.image === "string") {
      base64 = json.image;
    } else if ("artifacts" in json) {
      base64 = json.artifacts?.[0]?.base64;
    }
    if (!base64) return null;
    return { imageDataUri: `data:image/png;base64,${base64}` };
  } catch {
    return null;
  }
}

function sanitiseKey(raw: string): string {
  const m = raw.match(/nvapi-[A-Za-z0-9_-]+/);
  if (m) return m[0];
  return raw.trim();
}

/**
 * Inject the "leave a blank label surface" instruction into the user
 * prompt. The diffusion model is trained to interpret this as negative
 * space — Aura overlays the actual Arabic copy on top in a later stage.
 */
function appendBlankLabelInstruction(prompt: string): string {
  return `${prompt.trim()}, the product's main label is a clean blank matte surface with absolutely no text, letters, logos, or marks, ready for typography overlay; preserve the product geometry and material exactly`;
}
