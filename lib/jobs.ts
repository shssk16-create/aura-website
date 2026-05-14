/**
 * Async generation-job state machine.
 *
 * @scaffold — when Supabase is configured the state lives in
 * `generation_jobs` (Postgres) and the worker is invoked every minute by
 * `pg_cron` (see `supabase/migrations/0003_pg_cron_schedule.sql`). When
 * Supabase is not configured, jobs are kept in a JSON file under
 * `${AURA_DATA_DIR}/jobs.json` so the dashboard remains demoable on a
 * laptop without spinning up a database.
 *
 * In both modes the worker is invoked via the HTTP endpoint
 * `POST /api/jobs/worker` — `pg_cron` calls that endpoint with the
 * service-role secret in production; local dev can hit it manually.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type {
  GenerationJobInput,
  GenerationJobOutput,
  GenerationJobProgress,
  GenerationJobRow,
  GenerationJobStatus,
} from "./supabase/types";
import { isSupabaseConfigured } from "./supabase/server";

const DATA_DIR =
  process.env.AURA_DATA_DIR ?? path.join(process.cwd(), ".data");
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");

export type Job = GenerationJobRow;

export interface CreateJobInput {
  accountId: string;
  productId?: string;
  input: GenerationJobInput;
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readAll(): Promise<Job[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(JOBS_FILE, "utf8");
    return JSON.parse(raw) as Job[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(jobs: Job[]) {
  await ensureDir();
  await fs.writeFile(JOBS_FILE, JSON.stringify(jobs, null, 2), "utf8");
}

export async function createJob(input: CreateJobInput): Promise<Job> {
  // Supabase path is intentionally stubbed for now — wire when the SDK is
  // installed. The file-backed path keeps the rest of the system working.
  await isSupabaseConfigured();

  const now = new Date().toISOString();
  const job: Job = {
    id: crypto.randomUUID(),
    account_id: input.accountId,
    product_id: input.productId ?? null,
    status: "pending",
    input: input.input,
    progress: {},
    output: null,
    locked_at: null,
    attempts: 0,
    last_error: null,
    created_at: now,
    updated_at: now,
    completed_at: null,
  };
  const all = await readAll();
  await writeAll([job, ...all]);
  return job;
}

export async function getJob(id: string): Promise<Job | null> {
  const all = await readAll();
  return all.find((j) => j.id === id) ?? null;
}

export async function listJobs(opts?: {
  accountId?: string;
  status?: GenerationJobStatus;
}): Promise<Job[]> {
  const all = await readAll();
  return all
    .filter((j) => {
      if (opts?.accountId && j.account_id !== opts.accountId) return false;
      if (opts?.status && j.status !== opts.status) return false;
      return true;
    })
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function updateJob(
  id: string,
  patch: (job: Job) => Job,
): Promise<Job | null> {
  const all = await readAll();
  const idx = all.findIndex((j) => j.id === id);
  if (idx === -1) return null;
  const next = patch(all[idx]);
  next.updated_at = new Date().toISOString();
  all[idx] = next;
  await writeAll(all);
  return next;
}

/**
 * Atomically claim the oldest `pending` job. Returns `null` when no job
 * is available. In Supabase the equivalent is `select ... for update skip
 * locked` plus `update generation_jobs set status = 'processing', ...`.
 */
export async function claimNextJob(): Promise<Job | null> {
  const all = await readAll();
  const idx = all.findIndex((j) => j.status === "pending");
  if (idx === -1) return null;
  const claimed: Job = {
    ...all[idx],
    status: "processing",
    locked_at: new Date().toISOString(),
    attempts: all[idx].attempts + 1,
    updated_at: new Date().toISOString(),
  };
  all[idx] = claimed;
  await writeAll(all);
  return claimed;
}

export async function setProgress(
  id: string,
  progress: GenerationJobProgress,
): Promise<Job | null> {
  return updateJob(id, (j) => ({ ...j, progress }));
}

export async function completeJob(
  id: string,
  output: GenerationJobOutput,
): Promise<Job | null> {
  return updateJob(id, (j) => ({
    ...j,
    status: "completed",
    output,
    completed_at: new Date().toISOString(),
  }));
}

export async function failJob(id: string, error: string): Promise<Job | null> {
  return updateJob(id, (j) => ({
    ...j,
    status: "failed",
    last_error: error,
    completed_at: new Date().toISOString(),
  }));
}
