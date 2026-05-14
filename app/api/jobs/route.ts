/**
 * GET  /api/jobs?accountId=...      → list jobs for a tenant
 * POST /api/jobs                    → enqueue a new generation job
 *
 * Body for POST:
 *   {
 *     accountId: string;
 *     productId?: string;
 *     input: GenerationJobInput;     // brand, goal, audience, channel, tone, pipeline
 *   }
 */

import { NextResponse } from "next/server";
import { createJob, listJobs } from "@/lib/jobs";
import type {
  GenerationJobInput,
  GenerationJobStatus,
} from "@/lib/supabase/types";

export const runtime = "nodejs";

interface PostBody {
  accountId?: unknown;
  productId?: unknown;
  input?: unknown;
}

export async function POST(req: Request) {
  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "expected JSON body" }, { status: 400 });
  }
  const valid = validate(body);
  if (!valid.ok) {
    return NextResponse.json({ error: valid.error }, { status: 400 });
  }
  const job = await createJob({
    accountId: valid.value.accountId,
    productId: valid.value.productId,
    input: valid.value.input,
  });
  return NextResponse.json({ job }, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId") ?? undefined;
  const statusParam = searchParams.get("status");
  const status: GenerationJobStatus | undefined = isJobStatus(statusParam)
    ? statusParam
    : undefined;
  const jobs = await listJobs({ accountId, status });
  return NextResponse.json({ jobs });
}

function isJobStatus(value: string | null): value is GenerationJobStatus {
  return (
    value === "pending" ||
    value === "processing" ||
    value === "completed" ||
    value === "failed"
  );
}

interface Valid {
  accountId: string;
  productId?: string;
  input: GenerationJobInput;
}

function validate(
  body: PostBody,
): { ok: true; value: Valid } | { ok: false; error: string } {
  if (typeof body.accountId !== "string" || !body.accountId.trim()) {
    return { ok: false, error: "accountId is required" };
  }
  if (!body.input || typeof body.input !== "object") {
    return { ok: false, error: "input is required" };
  }
  const i = body.input as Record<string, unknown>;
  if (typeof i.brand !== "string" || !i.brand.trim()) {
    return { ok: false, error: "input.brand is required" };
  }
  if (typeof i.goal !== "string" || !i.goal.trim()) {
    return { ok: false, error: "input.goal is required" };
  }
  if (typeof i.audience !== "string") {
    return { ok: false, error: "input.audience must be a string" };
  }
  if (typeof i.channel !== "string") {
    return { ok: false, error: "input.channel must be a string" };
  }
  if (typeof i.tone !== "string") {
    return { ok: false, error: "input.tone must be a string" };
  }
  if (!Array.isArray(i.pipeline)) {
    return { ok: false, error: "input.pipeline must be an array" };
  }
  const pipeline = i.pipeline.filter(
    (id): id is string => typeof id === "string",
  );
  return {
    ok: true,
    value: {
      accountId: body.accountId.trim(),
      productId:
        typeof body.productId === "string" ? body.productId : undefined,
      input: {
        brand: i.brand.trim(),
        goal: i.goal.trim(),
        audience: i.audience.trim(),
        channel: i.channel.trim(),
        tone: i.tone.trim(),
        headline: typeof i.headline === "string" ? i.headline.trim() : undefined,
        pipeline,
      },
    },
  };
}
