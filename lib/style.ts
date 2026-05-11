/**
 * Style library — user-supplied Arabic sample texts that AURA injects as
 * few-shot examples into the agent system prompts, so the live model output
 * mimics the user's brand voice instead of generic White-Arabic boilerplate.
 *
 * Storage is intentionally simple: a single JSON file under
 * `${AURA_DATA_DIR}/style.json`. Replace with Postgres / Drizzle when wiring
 * real multi-tenant auth.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { AgentId } from "./agents";

const DATA_DIR =
  process.env.AURA_DATA_DIR ?? path.join(process.cwd(), ".data");
const STYLE_FILE = path.join(DATA_DIR, "style.json");

export type ChannelFilter =
  | "any"
  | "instagram"
  | "x"
  | "tiktok"
  | "linkedin"
  | "web";
export type ToneFilter =
  | "any"
  | "corporate"
  | "youthful"
  | "luxury"
  | "playful";

export interface StyleSample {
  id: string;
  /** Brand whose voice this sample illustrates. */
  brand: string;
  /** Channel filter — "any" means match every channel. */
  channel: ChannelFilter;
  /** Tone filter — "any" means match every tone. */
  tone: ToneFilter;
  /**
   * Optional whitelist of agent ids this sample is for. Empty/undefined =
   * apply to the copywriter (the primary voice agent) by default.
   */
  agents?: AgentId[];
  /** The actual Arabic body text the agent should mimic. */
  text: string;
  /** Short Arabic label, e.g. "إعلان فاخر للعطور". */
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface StyleSampleInput {
  brand: string;
  channel: ChannelFilter;
  tone: ToneFilter;
  agents?: AgentId[];
  text: string;
  label: string;
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readAll(): Promise<StyleSample[]> {
  try {
    const raw = await fs.readFile(STYLE_FILE, "utf8");
    return JSON.parse(raw) as StyleSample[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(samples: StyleSample[]) {
  await ensureDir();
  await fs.writeFile(STYLE_FILE, JSON.stringify(samples, null, 2), "utf8");
}

export async function listSamples(): Promise<StyleSample[]> {
  const all = await readAll();
  return [...all].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createSample(
  input: StyleSampleInput,
): Promise<StyleSample> {
  if (!input.brand.trim() || !input.text.trim()) {
    throw new Error("brand and text are required");
  }
  const all = await readAll();
  const now = new Date().toISOString();
  const sample: StyleSample = {
    id: crypto.randomUUID(),
    brand: input.brand.trim(),
    channel: input.channel,
    tone: input.tone,
    agents: input.agents,
    text: input.text.trim(),
    label: input.label.trim() || `${input.brand.trim()} — ${now.slice(0, 10)}`,
    createdAt: now,
    updatedAt: now,
  };
  await writeAll([sample, ...all]);
  return sample;
}

export async function updateSample(
  id: string,
  patch: Partial<StyleSampleInput>,
): Promise<StyleSample | null> {
  const all = await readAll();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const next: StyleSample = {
    ...all[idx],
    ...patch,
    brand: (patch.brand ?? all[idx].brand).trim(),
    text: (patch.text ?? all[idx].text).trim(),
    label: (patch.label ?? all[idx].label).trim() || all[idx].label,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = next;
  await writeAll(all);
  return next;
}

export async function deleteSample(id: string): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((s) => s.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}

/**
 * Score and pick up to `limit` samples that best match the active campaign,
 * for the named agent. Scoring is intentionally simple and deterministic:
 *
 *   - +5 if `agents` whitelist includes this agent (or is empty + agent is
 *     "copywriter").
 *   - +3 if brand matches exactly (case-insensitive).
 *   - +1 if brand contains the input as a substring (or vice-versa).
 *   - +2 if channel matches; +1 if sample channel is "any".
 *   - +2 if tone matches; +1 if sample tone is "any".
 *
 * Returns the top `limit` samples sorted by score (descending). Samples
 * scoring 0 are dropped — they never get injected.
 */
export async function pickSamplesForCampaign(opts: {
  brand: string;
  channel: string;
  tone: string;
  agent: AgentId;
  limit?: number;
}): Promise<StyleSample[]> {
  const { brand, channel, tone, agent } = opts;
  const limit = opts.limit ?? 3;
  const all = await listSamples();
  const brandLower = brand.toLowerCase();

  const scored = all.map((sample) => {
    let score = 0;
    const agents = sample.agents ?? ["copywriter"];
    if (agents.includes(agent)) score += 5;
    const sampleBrandLower = sample.brand.toLowerCase();
    if (sampleBrandLower === brandLower) score += 3;
    else if (
      sampleBrandLower.includes(brandLower) ||
      brandLower.includes(sampleBrandLower)
    )
      score += 1;
    if (sample.channel === channel) score += 2;
    else if (sample.channel === "any") score += 1;
    if (sample.tone === tone) score += 2;
    else if (sample.tone === "any") score += 1;
    return { sample, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored
    .filter((s) => s.score > 0)
    .slice(0, limit)
    .map((s) => s.sample);
}

/**
 * Build a short Arabic preface block to prepend to the user prompt with the
 * style samples as worked examples. Returns the empty string when no
 * samples match.
 */
export function formatSamplesAsFewShot(samples: StyleSample[]): string {
  if (samples.length === 0) return "";
  const blocks = samples.map(
    (sample, i) =>
      `### مثال ${i + 1} — ${sample.label}\n${sample.text}`,
  );
  return [
    "فيما يلي عيِّنات من نبرة العلامة. اكتب جوابك بنفس النبرة بدون نسخ الجمل حرفيًّا:",
    "",
    blocks.join("\n\n"),
    "",
    "— نهاية العيِّنات —",
    "",
  ].join("\n");
}
