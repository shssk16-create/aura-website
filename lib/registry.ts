/**
 * Agent registry — merges built-in defaults with user overrides + custom
 * agents stored on disk at `${AURA_DATA_DIR}/agents.json`.
 *
 * On-disk shape:
 *
 *   {
 *     "overrides": { "manager": { "nameAr": "...", "inference": {...} } },
 *     "customs":   [ { id: "pr-expert", nameAr: "...", ... } ]
 *   }
 *
 * The orchestrator and all UI pages should read agents through
 * `getAgents()` / `getAgentById()` so user edits take effect without a
 * server restart and without losing the built-in defaults.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import {
  AGENT_ACCENTS,
  AGENT_ICONS,
  BUILTIN_AGENT_IDS,
  DEFAULT_AGENTS,
  type AgentDefinition,
  type AgentId,
  type ProviderId,
} from "./agents";

const DATA_DIR =
  process.env.AURA_DATA_DIR ?? path.join(process.cwd(), ".data");
const AGENTS_FILE = path.join(DATA_DIR, "agents.json");

interface RegistryFile {
  overrides: Record<string, Partial<AgentDefinition>>;
  customs: AgentDefinition[];
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readFileSafe(): Promise<RegistryFile> {
  try {
    const raw = await fs.readFile(AGENTS_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<RegistryFile>;
    return {
      overrides: parsed.overrides ?? {},
      customs: Array.isArray(parsed.customs) ? parsed.customs : [],
    };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return { overrides: {}, customs: [] };
    }
    throw err;
  }
}

async function writeFileSafe(file: RegistryFile) {
  await ensureDir();
  await fs.writeFile(AGENTS_FILE, JSON.stringify(file, null, 2), "utf8");
}

/**
 * Apply a partial override on top of a default agent definition. Nested
 * blocks (`inference`, `imageInference`) are merged shallowly — pass the
 * full block to replace it.
 */
function applyOverride(
  base: AgentDefinition,
  patch: Partial<AgentDefinition>,
): AgentDefinition {
  return {
    ...base,
    ...patch,
    // Force the id to stay constant — overrides can't rename a built-in.
    id: base.id,
    inference: patch.inference
      ? { ...base.inference, ...patch.inference }
      : base.inference,
    imageInference: patch.imageInference
      ? { ...base.imageInference, ...patch.imageInference }
      : base.imageInference,
    custom: false,
  };
}

/**
 * Return the live merged agent list: built-in defaults (with user overrides
 * applied) + user custom agents. Sorted by `stage` ascending. Disabled
 * agents are included but flagged so the UI can render them as inactive.
 */
export async function getAgents(): Promise<AgentDefinition[]> {
  const file = await readFileSafe();
  const merged: AgentDefinition[] = DEFAULT_AGENTS.map((base) => {
    const patch = file.overrides[base.id];
    return patch ? applyOverride(base, patch) : base;
  });
  for (const c of file.customs) {
    merged.push({ ...c, custom: true });
  }
  return merged.sort((a, b) => a.stage - b.stage);
}

export async function getAgentById(
  id: AgentId,
): Promise<AgentDefinition | undefined> {
  const all = await getAgents();
  return all.find((a) => a.id === id);
}

export async function getAgentsById(): Promise<Record<AgentId, AgentDefinition>> {
  const all = await getAgents();
  const map: Record<AgentId, AgentDefinition> = {};
  for (const a of all) map[a.id] = a;
  return map;
}

/**
 * Order of agent ids in the default campaign pipeline: agents with
 * `pipelineEnabled: true` and not disabled, sorted by `stage`.
 */
export async function getDefaultPipeline(): Promise<AgentId[]> {
  const all = await getAgents();
  return all
    .filter((a) => a.pipelineEnabled && !a.disabled)
    .sort((a, b) => a.stage - b.stage)
    .map((a) => a.id);
}

/**
 * Public-safe shape returned to the browser. Identical to AgentDefinition
 * today, but kept as a separate type so future plaintext-sensitive fields
 * (system prompts containing secrets, etc.) can be elided server-side
 * without breaking callers.
 */
export type PublicAgent = AgentDefinition;

const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,40}$/;

function isValidUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function trimStringField(value: unknown, max = 4000): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

/** Validate + normalise a user-provided agent payload. */
export function validateAgentInput(
  body: unknown,
  opts: { id: string; expectCustom: boolean },
): { ok: true; value: AgentDefinition } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;
  const id = opts.id;
  if (!ID_PATTERN.test(id)) {
    return {
      ok: false,
      error:
        "id must be lowercase letters/numbers/hyphens, 1–41 chars (e.g. pr-expert)",
    };
  }
  if (opts.expectCustom) {
    if ((BUILTIN_AGENT_IDS as readonly string[]).includes(id)) {
      return { ok: false, error: "this id is reserved for a built-in agent" };
    }
  }

  const nameAr = trimStringField(b.nameAr, 80);
  const nameEn = trimStringField(b.nameEn, 80) ?? id;
  const descriptionAr = trimStringField(b.descriptionAr, 600) ?? "";
  const model = trimStringField(b.model, 200) ?? "";
  const endpointEnv = trimStringField(b.endpointEnv, 80) ?? "";
  const systemPromptAr = trimStringField(b.systemPromptAr, 4000);

  if (!nameAr) return { ok: false, error: "nameAr is required" };

  const stage = typeof b.stage === "number" ? b.stage : 0;
  const accent = (
    AGENT_ACCENTS as readonly string[]
  ).includes(b.accent as string)
    ? (b.accent as AgentDefinition["accent"])
    : "blue";
  const icon = (AGENT_ICONS as readonly string[]).includes(b.icon as string)
    ? (b.icon as AgentDefinition["icon"])
    : "Bot";

  let inference: AgentDefinition["inference"];
  if (b.inference && typeof b.inference === "object") {
    const inf = b.inference as Record<string, unknown>;
    const provider = inf.provider;
    const url = trimStringField(inf.url, 500);
    const infModel = trimStringField(inf.model, 200);
    const keyEnv = trimStringField(inf.keyEnv, 80);
    if (
      typeof provider === "string" &&
      ["nvidia", "zai", "openai-compatible"].includes(provider) &&
      url &&
      isValidUrl(url) &&
      infModel &&
      keyEnv
    ) {
      inference = {
        provider: provider as ProviderId,
        url,
        model: infModel,
        keyEnv,
        reasoning: Boolean(inf.reasoning),
      };
    } else if (Object.keys(inf).length > 0) {
      return {
        ok: false,
        error: "inference must include valid provider, url, model, keyEnv",
      };
    }
  }

  let imageInference: AgentDefinition["imageInference"];
  if (b.imageInference && typeof b.imageInference === "object") {
    const inf = b.imageInference as Record<string, unknown>;
    const url = trimStringField(inf.url, 500);
    const imgModel = trimStringField(inf.model, 200);
    const keyEnv = trimStringField(inf.keyEnv, 80);
    const steps = typeof inf.steps === "number" ? inf.steps : 4;
    if (url && isValidUrl(url) && imgModel && keyEnv) {
      imageInference = {
        provider: "nvidia-image",
        url,
        model: imgModel,
        keyEnv,
        steps,
      };
    } else if (Object.keys(inf).length > 0) {
      return {
        ok: false,
        error: "imageInference must include valid url, model, keyEnv",
      };
    }
  }

  const value: AgentDefinition = {
    id,
    nameAr,
    nameEn,
    descriptionAr,
    model,
    endpointEnv,
    inference,
    imageInference,
    systemPromptAr,
    icon,
    stage,
    accent,
    pipelineEnabled: Boolean(b.pipelineEnabled),
    disabled: Boolean(b.disabled),
    custom: opts.expectCustom,
  };
  return { ok: true, value };
}

/**
 * Create a new custom agent. Throws when the id is already in use (built-in
 * or another custom).
 */
export async function createCustomAgent(
  agent: AgentDefinition,
): Promise<AgentDefinition> {
  const file = await readFileSafe();
  if (file.customs.some((c) => c.id === agent.id)) {
    throw new Error("an agent with this id already exists");
  }
  const next: RegistryFile = {
    ...file,
    customs: [...file.customs, { ...agent, custom: true }],
  };
  await writeFileSafe(next);
  return { ...agent, custom: true };
}

/**
 * Update an existing agent (built-in or custom).
 *
 *   - Built-in agents: stored as a partial override on top of the default.
 *   - Custom agents:   replaced in the customs array.
 */
export async function updateAgent(
  id: AgentId,
  patch: Partial<AgentDefinition>,
): Promise<AgentDefinition> {
  const file = await readFileSafe();
  // Custom?
  const idx = file.customs.findIndex((c) => c.id === id);
  if (idx !== -1) {
    const merged: AgentDefinition = {
      ...file.customs[idx],
      ...patch,
      id, // pin id
      inference: patch.inference
        ? { ...file.customs[idx].inference, ...patch.inference }
        : file.customs[idx].inference,
      imageInference: patch.imageInference
        ? { ...file.customs[idx].imageInference, ...patch.imageInference }
        : file.customs[idx].imageInference,
      custom: true,
    };
    const next: RegistryFile = {
      ...file,
      customs: file.customs.map((c, i) => (i === idx ? merged : c)),
    };
    await writeFileSafe(next);
    return merged;
  }
  // Built-in?
  const base = DEFAULT_AGENTS.find((a) => a.id === id);
  if (!base) throw new Error(`unknown agent: ${id}`);
  const nextOverride: Partial<AgentDefinition> = {
    ...(file.overrides[id] ?? {}),
    ...patch,
  };
  const next: RegistryFile = {
    ...file,
    overrides: { ...file.overrides, [id]: nextOverride },
  };
  await writeFileSafe(next);
  return applyOverride(base, nextOverride);
}

/**
 * Delete or reset an agent.
 *
 *   - Custom agent: removed entirely.
 *   - Built-in agent: clears the override, restoring the default.
 *
 * Returns true when something was actually removed/reset.
 */
export async function deleteAgent(id: AgentId): Promise<boolean> {
  const file = await readFileSafe();
  let changed = false;
  let nextOverrides = file.overrides;
  let nextCustoms = file.customs;
  if (file.overrides[id]) {
    nextOverrides = { ...file.overrides };
    delete nextOverrides[id];
    changed = true;
  }
  const idx = file.customs.findIndex((c) => c.id === id);
  if (idx !== -1) {
    nextCustoms = file.customs.filter((c) => c.id !== id);
    changed = true;
  }
  if (!changed) return false;
  await writeFileSafe({ overrides: nextOverrides, customs: nextCustoms });
  return true;
}
