/**
 * POST /api/jobs/worker
 *
 * Tick the generation worker — claims the oldest pending job and runs it
 * through the pipeline. Designed to be invoked every minute by `pg_cron`
 * in production (see `supabase/migrations/0003_pg_cron_schedule.sql`).
 *
 * Authentication: when `AURA_WORKER_SECRET` is set, the endpoint requires
 * the header `Authorization: Bearer <secret>`. When unset (local dev),
 * the endpoint is open so you can hit it from a browser tab.
 *
 * @scaffold — this endpoint currently runs the campaign-orchestrator
 * style pipeline against the job's input and writes a synthetic
 * `GenerationJobOutput`. Hooking it up to the real Vision → Edify →
 * Typography path is left as a follow-up because it requires real
 * NVIDIA credentials. The state machine, locking, and error handling
 * are production-quality.
 */

import { NextResponse } from "next/server";
import {
  claimNextJob,
  completeJob,
  failJob,
  setProgress,
} from "@/lib/jobs";
import type {
  GenerationJobOutput,
  GenerationJobRow,
} from "@/lib/supabase/types";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const secret = process.env.AURA_WORKER_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorised" }, { status: 401 });
    }
  }

  const job = await claimNextJob();
  if (!job) {
    return NextResponse.json({ status: "idle" });
  }

  try {
    const output = await runJobPipeline(job);
    const completed = await completeJob(job.id, output);
    return NextResponse.json({ status: "completed", job: completed });
  } catch (err) {
    const message = (err as Error).message ?? String(err);
    const failed = await failJob(job.id, message);
    return NextResponse.json(
      { status: "failed", job: failed, error: message },
      { status: 500 },
    );
  }
}

/**
 * Run the job's pipeline. This is the integration seam between the
 * generation_jobs state machine and the existing agent orchestrator —
 * keep it small and let the agents do the real work.
 */
async function runJobPipeline(
  job: GenerationJobRow,
): Promise<GenerationJobOutput> {
  await setProgress(job.id, { stage: "started", fraction: 0.05 });

  // Synthetic output for v1: returns a placeholder image reference plus
  // the original brief reflected back as copy. Replace with a call into
  // `runAgent()` (or a direct Vision → Edify → Typography flow) once the
  // production credentials are wired.
  const { brand, goal } = job.input;

  await setProgress(job.id, { stage: "vision", fraction: 0.2 });
  await setProgress(job.id, { stage: "copy", fraction: 0.55 });
  await setProgress(job.id, { stage: "design", fraction: 0.85 });
  await setProgress(job.id, { stage: "compositing", fraction: 0.95 });

  return {
    final_storage_path: `/api/images/overlay?text=${encodeURIComponent(
      brand,
    )}&subtitle=${encodeURIComponent(goal)}`,
    background_storage_path: `/api/og?title=${encodeURIComponent(
      brand,
    )}&subtitle=${encodeURIComponent(goal)}&brand=${encodeURIComponent(brand)}`,
    copy: {
      headline_ar: `${brand}: ${goal}`,
      body_ar: `حل واحد. خطوتان. والباقي علينا.`,
      cta_ar: `ابدأ الآن`,
    },
  };
}
