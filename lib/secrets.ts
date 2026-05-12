/**
 * Encrypted secrets store for AURA AI.
 *
 * Stores API keys for live inference providers on disk under
 * `${AURA_DATA_DIR}/secrets.enc`, encrypted with AES-256-GCM. The encryption
 * master key is read from `AURA_MASTER_KEY` (base64-encoded 32 bytes) when
 * present; otherwise a fresh master key is generated on first run and
 * persisted to `${AURA_DATA_DIR}/master.key` (mode 0600, gitignored).
 *
 * Security model:
 *
 *   - Plaintext API keys never leave this module: `listSlots()` exposes
 *     only a 4-char tail + timestamp, and `pingSlot()` performs a one-shot
 *     provider call locally without returning the key.
 *   - The orchestrator reads keys via `getKey(slot)` only at the moment
 *     of an outbound HTTP call, never caching them in memory beyond the
 *     scope of a single agent run.
 *   - `process.env` is still consulted as a fallback so existing deploys
 *     with env-var-only secrets keep working transparently.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { type AgentDefinition } from "./agents";
import { getAgents } from "./registry";

const DATA_DIR =
  process.env.AURA_DATA_DIR ?? path.join(process.cwd(), ".data");
const SECRETS_FILE = path.join(DATA_DIR, "secrets.enc");
const MASTER_KEY_FILE = path.join(DATA_DIR, "master.key");

/** Description of a single key slot exposed in the management UI. */
export interface KeySlot {
  /** Storage key — also the legacy env-var name. */
  name: string;
  /** Arabic display label. */
  labelAr: string;
  /** Provider-facing description (English, for the table). */
  providerLabel: string;
  /** Arabic names of the agents that consume this slot. */
  usedByAr: string[];
  /** How the "اختبار" (ping) button should verify the key. */
  ping: KeyPingConfig;
}

export type KeyPingConfig =
  | {
      kind: "openai-chat";
      url: string;
      /** Model id used for the minimal `max_tokens: 1` ping call. */
      model: string;
      /**
       * Provider-tag, controls per-provider key sanitisation. Matches
       * `ProviderId` in `lib/agents.ts`.
       */
      provider: "nvidia" | "zai" | "openai-compatible";
    }
  | {
      kind: "nvidia-image";
      url: string;
      /** Optional override; pings the configured FLUX URL by default. */
      model?: string;
    }
  | {
      /** Just confirm the value is non-empty (for slots not yet wired). */
      kind: "presence-only";
    };

/**
 * Slot registry — derived from the live agent registry so adding an agent
 * automatically adds its slot. Slots without an agent yet (Deepseek, Seo,
 * Seo2) are declared explicitly so the UI still shows them.
 */
export async function listSlotConfig(): Promise<KeySlot[]> {
  const fromAgents = new Map<string, KeySlot>();
  const agents = await getAgents();

  for (const agent of agents) {
    if (agent.inference) {
      const slot = agent.inference.keyEnv;
      const prev = fromAgents.get(slot);
      const labelMap: Record<string, string> = {
        nvidia: "NVIDIA NIM",
        zai: "Z.AI / GLM",
        "openai-compatible": "OpenAI-compatible",
      };
      const providerLabel = `${labelMap[agent.inference.provider]} · ${agent.inference.model}`;
      const ping: KeyPingConfig = {
        kind: "openai-chat",
        url: agent.inference.url,
        model: agent.inference.model,
        provider: agent.inference.provider,
      };
      if (prev) {
        prev.usedByAr.push(agent.nameAr);
      } else {
        fromAgents.set(slot, {
          name: slot,
          labelAr: providerSlotLabel(slot),
          providerLabel,
          usedByAr: [agent.nameAr],
          ping,
        });
      }
    }
    if (agent.imageInference) {
      const slot = agent.imageInference.keyEnv;
      const providerLabel = `NVIDIA NIM (Image) · ${agent.imageInference.model}`;
      const ping: KeyPingConfig = {
        kind: "nvidia-image",
        url: agent.imageInference.url,
      };
      const prev = fromAgents.get(slot);
      if (prev) {
        prev.usedByAr.push(agent.nameAr);
      } else {
        fromAgents.set(slot, {
          name: slot,
          labelAr: providerSlotLabel(slot),
          providerLabel,
          usedByAr: [agent.nameAr],
          ping,
        });
      }
    }
  }

  // Slots that have a stored secret but no agent wired yet — declared so
  // the UI keeps them as "presence-only" rows until the agent is added.
  const placeholders: KeySlot[] = [
    {
      name: "Deepseeksocialmediaspecilist",
      labelAr: "DeepSeek (أخصائي السوشيال)",
      providerLabel: "DeepSeek · (model TBD)",
      usedByAr: ["أخصائي السوشيال"],
      ping: { kind: "presence-only" },
    },
    {
      name: "Seo",
      labelAr: "خبير السيو (مزوِّد ١)",
      providerLabel: "SEO provider 1 · (model TBD)",
      usedByAr: ["خبير السيو"],
      ping: { kind: "presence-only" },
    },
    {
      name: "Seo2",
      labelAr: "خبير السيو (مزوِّد ٢)",
      providerLabel: "SEO provider 2 · (model TBD)",
      usedByAr: ["خبير السيو"],
      ping: { kind: "presence-only" },
    },
  ];

  for (const p of placeholders) {
    if (!fromAgents.has(p.name)) fromAgents.set(p.name, p);
  }

  // Stable ordering for the UI.
  const order = [
    "Api",
    "Glm",
    "Flux",
    "Deepseeksocialmediaspecilist",
    "Seo",
    "Seo2",
  ];
  return [...fromAgents.values()].sort(
    (a, b) =>
      (order.indexOf(a.name) === -1 ? 99 : order.indexOf(a.name)) -
      (order.indexOf(b.name) === -1 ? 99 : order.indexOf(b.name)),
  );
}

function providerSlotLabel(slot: string): string {
  switch (slot) {
    case "Api":
      return "NVIDIA NIM (Chat)";
    case "Glm":
      return "Z.AI / GLM";
    case "Flux":
      return "NVIDIA NIM (Image)";
    default:
      return slot;
  }
}

/** Public mask shape returned to the UI — never includes plaintext. */
export interface KeyMask {
  slot: string;
  configured: boolean;
  /** Where the value lives: encrypted store, env var, or nowhere. */
  source: "store" | "env" | "none";
  /** Last 4 chars of the plaintext, or null if not configured. */
  last4: string | null;
  updatedAt: string | null;
}

interface StoredRecord {
  iv: string;        // base64
  ciphertext: string; // base64
  tag: string;       // base64
  last4: string;
  updatedAt: string;
}

type StoreFile = Record<string, StoredRecord>;

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function loadMasterKey(): Promise<Buffer> {
  const fromEnv = process.env.AURA_MASTER_KEY;
  if (fromEnv && fromEnv.length > 0) {
    // Accept either a 44-char base64 (32 raw bytes) or any other string
    // and derive a 32-byte key via SHA-256. The SHA path is a forgiveness
    // mode for users who paste a random passphrase.
    if (/^[A-Za-z0-9+/=]+$/.test(fromEnv) && fromEnv.length >= 43) {
      const buf = Buffer.from(fromEnv, "base64");
      if (buf.length === 32) return buf;
    }
    return crypto.createHash("sha256").update(fromEnv).digest();
  }

  await ensureDataDir();
  try {
    const existing = await fs.readFile(MASTER_KEY_FILE, "utf8");
    const buf = Buffer.from(existing.trim(), "base64");
    if (buf.length === 32) return buf;
    // File is corrupted/wrong shape — regenerate.
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }

  const fresh = crypto.randomBytes(32);
  await fs.writeFile(MASTER_KEY_FILE, fresh.toString("base64"), { mode: 0o600 });
  return fresh;
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await fs.readFile(SECRETS_FILE, "utf8");
    return JSON.parse(raw) as StoreFile;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw err;
  }
}

async function writeStore(store: StoreFile) {
  await ensureDataDir();
  await fs.writeFile(SECRETS_FILE, JSON.stringify(store, null, 2), {
    mode: 0o600,
  });
}

function last4(value: string): string {
  const trimmed = value.trim();
  return trimmed.length <= 4 ? trimmed : trimmed.slice(-4);
}

/**
 * Look up the plaintext key for a slot. Checks the encrypted store first
 * and falls back to `process.env[slot]` for backwards compatibility with
 * env-var-only deploys.
 */
export async function getKey(slot: string): Promise<string | undefined> {
  const store = await readStore();
  const record = store[slot];
  if (record) {
    try {
      const masterKey = await loadMasterKey();
      const iv = Buffer.from(record.iv, "base64");
      const ciphertext = Buffer.from(record.ciphertext, "base64");
      const tag = Buffer.from(record.tag, "base64");
      const decipher = crypto.createDecipheriv("aes-256-gcm", masterKey, iv);
      decipher.setAuthTag(tag);
      const plaintext = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
      ]);
      return plaintext.toString("utf8");
    } catch (err) {
      // Master-key rotation or corruption — fall through to env so the
      // app doesn't break for the user. Surface the issue in the log.
      console.warn(
        `[secrets] failed to decrypt slot "${slot}": ${(err as Error).message}; falling back to env`,
      );
    }
  }
  const fromEnv = process.env[slot];
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return undefined;
}

/** Encrypt and persist a new value for a slot. */
export async function setKey(
  slot: string,
  plaintext: string,
): Promise<KeyMask> {
  const trimmed = plaintext.trim();
  if (!trimmed) throw new Error("empty value");
  const masterKey = await loadMasterKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", masterKey, iv);
  const ciphertext = Buffer.concat([
    cipher.update(trimmed, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  const record: StoredRecord = {
    iv: iv.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
    tag: tag.toString("base64"),
    last4: last4(trimmed),
    updatedAt: new Date().toISOString(),
  };
  const store = await readStore();
  store[slot] = record;
  await writeStore(store);
  return {
    slot,
    configured: true,
    source: "store",
    last4: record.last4,
    updatedAt: record.updatedAt,
  };
}

/** Remove a stored key for a slot. Env fallback still applies on lookup. */
export async function deleteKey(slot: string): Promise<boolean> {
  const store = await readStore();
  if (!(slot in store)) return false;
  delete store[slot];
  await writeStore(store);
  return true;
}

/**
 * Return masked metadata for every declared slot — store-managed, env-only,
 * or unset. Never returns plaintext.
 */
export async function listMasks(): Promise<KeyMask[]> {
  const slots = await listSlotConfig();
  const store = await readStore();
  return slots.map((slot) => {
    const record = store[slot.name];
    if (record) {
      return {
        slot: slot.name,
        configured: true,
        source: "store" as const,
        last4: record.last4,
        updatedAt: record.updatedAt,
      };
    }
    const fromEnv = process.env[slot.name];
    if (fromEnv && fromEnv.length > 0) {
      return {
        slot: slot.name,
        configured: true,
        source: "env" as const,
        last4: last4(fromEnv),
        updatedAt: null,
      };
    }
    return {
      slot: slot.name,
      configured: false,
      source: "none" as const,
      last4: null,
      updatedAt: null,
    };
  });
}

export interface PingResult {
  ok: boolean;
  latencyMs?: number;
  status?: number;
  /** Optional one-line error string (no plaintext, no full provider body). */
  error?: string;
}

/**
 * Make a one-shot, minimal request to the provider to confirm the stored
 * key is accepted. The plaintext key is read locally and never returned.
 */
export async function pingSlot(slot: string): Promise<PingResult> {
  const slots = await listSlotConfig();
  const cfg = slots.find((s) => s.name === slot);
  if (!cfg) return { ok: false, error: "unknown slot" };
  const key = await getKey(slot);
  if (!key) return { ok: false, error: "no key configured" };

  const sanitized = sanitizeKey(cfg.ping, key);

  if (cfg.ping.kind === "presence-only") {
    return { ok: true };
  }
  const start = Date.now();
  try {
    if (cfg.ping.kind === "openai-chat") {
      const res = await fetch(cfg.ping.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sanitized}`,
        },
        body: JSON.stringify({
          model: cfg.ping.model,
          stream: false,
          max_tokens: 1,
          messages: [{ role: "user", content: "ping" }],
        }),
      });
      const latencyMs = Date.now() - start;
      if (res.ok) return { ok: true, latencyMs, status: res.status };
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        latencyMs,
        status: res.status,
        error: oneLine(text).slice(0, 200),
      };
    }
    if (cfg.ping.kind === "nvidia-image") {
      // Do not run a full diffusion request just to ping; instead, send a
      // deliberately-malformed POST and accept any 4xx that isn't 401/403
      // as proof that the auth header was accepted.
      const res = await fetch(cfg.ping.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sanitized}`,
        },
        body: JSON.stringify({ prompt: "ping", steps: 1 }),
      });
      const latencyMs = Date.now() - start;
      if (res.ok) return { ok: true, latencyMs, status: res.status };
      if (res.status === 401 || res.status === 403) {
        const text = await res.text().catch(() => "");
        return {
          ok: false,
          latencyMs,
          status: res.status,
          error: oneLine(text).slice(0, 200),
        };
      }
      // 400/422 etc still proves the bearer was accepted — that's all we want.
      return { ok: true, latencyMs, status: res.status };
    }
  } catch (err) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: (err as Error).message.slice(0, 200),
    };
  }
  return { ok: false, error: "unsupported ping kind" };
}

/**
 * Strip TOML/JSON wrappers from a stored value so the orchestrator-style
 * sanitisation matches what `lib/orchestrator.ts` does on the live path.
 */
function sanitizeKey(ping: KeyPingConfig, raw: string): string {
  if (ping.kind === "openai-chat" && ping.provider === "nvidia") {
    const m = raw.match(/nvapi-[A-Za-z0-9_-]+/);
    if (m) return m[0];
  }
  if (ping.kind === "nvidia-image") {
    const m = raw.match(/nvapi-[A-Za-z0-9_-]+/);
    if (m) return m[0];
  }
  const quoted = raw.match(/"([^"\r\n]+)"/);
  if (quoted) return quoted[1].trim();
  return raw.trim();
}

function oneLine(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * True when the agent has a usable key — either in the encrypted store, a
 * `process.env[keyEnv]` fallback, or a custom `endpointEnv` URL. Use this
 * in server components that want the same status badge `isAgentConnected`
 * (sync, env-only) returned previously, but also reflect UI-saved keys.
 */
export async function isAgentConnectedAsync(
  agent: AgentDefinition,
): Promise<boolean> {
  const slots: string[] = [];
  if (agent.inference) slots.push(agent.inference.keyEnv);
  if (agent.imageInference) slots.push(agent.imageInference.keyEnv);
  for (const slot of slots) {
    const v = await getKey(slot);
    if (v && v.length > 0) return true;
  }
  return Boolean(process.env[agent.endpointEnv]);
}
