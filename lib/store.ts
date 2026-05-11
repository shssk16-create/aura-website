/**
 * Tiny file-backed JSON store for campaigns.
 *
 * This is intentionally simple — v1 keeps state on disk so the UI is fully
 * usable without spinning up a real database. Replace with Postgres / Drizzle
 * when wiring real auth and multi-tenant isolation.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import type { AgentId } from "./agents";

const DATA_DIR =
  process.env.AURA_DATA_DIR ?? path.join(process.cwd(), ".data");
const CAMPAIGNS_FILE = path.join(DATA_DIR, "campaigns.json");

export type CampaignStatus = "draft" | "running" | "completed" | "failed";
export type AgentRunStatus = "pending" | "running" | "completed" | "failed";

export interface AgentRun {
  agentId: AgentId;
  status: AgentRunStatus;
  startedAt: string | null;
  completedAt: string | null;
  /** Streamed text output produced by the agent. */
  output: string;
}

export interface Campaign {
  id: string;
  name: string;
  brand: string;
  goal: string;
  audience: string;
  channel: "instagram" | "x" | "tiktok" | "linkedin" | "web";
  tone: "corporate" | "youthful" | "luxury" | "playful";
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
  pipeline: AgentRun[];
  /** Final creative output (text + optional image URL). */
  creative: {
    copyAr: string;
    headlineAr: string;
    cta: string;
    imageUrl: string | null;
  } | null;
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readAll(): Promise<Campaign[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(CAMPAIGNS_FILE, "utf8");
    return JSON.parse(raw) as Campaign[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(campaigns: Campaign[]) {
  await ensureDir();
  await fs.writeFile(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2), "utf8");
}

export async function listCampaigns(): Promise<Campaign[]> {
  const all = await readAll();
  return [...all].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const all = await readAll();
  return all.find((c) => c.id === id) ?? null;
}

export async function createCampaign(
  input: Omit<
    Campaign,
    "id" | "status" | "createdAt" | "updatedAt" | "pipeline" | "creative"
  > & { pipeline: AgentId[] },
): Promise<Campaign> {
  const all = await readAll();
  const now = new Date().toISOString();
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);

  const campaign: Campaign = {
    id,
    name: input.name,
    brand: input.brand,
    goal: input.goal,
    audience: input.audience,
    channel: input.channel,
    tone: input.tone,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    pipeline: input.pipeline.map((agentId) => ({
      agentId,
      status: "pending",
      startedAt: null,
      completedAt: null,
      output: "",
    })),
    creative: null,
  };

  await writeAll([campaign, ...all]);
  return campaign;
}

export async function updateCampaign(
  id: string,
  patch: (campaign: Campaign) => Campaign,
): Promise<Campaign | null> {
  const all = await readAll();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const updated = patch(all[idx]);
  updated.updatedAt = new Date().toISOString();
  all[idx] = updated;
  await writeAll(all);
  return updated;
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((c) => c.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}
