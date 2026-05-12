import { NextResponse } from "next/server";
import {
  deleteAgent,
  getAgentById,
  updateAgent,
  validateAgentInput,
} from "@/lib/registry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/agents/:id — fetch the live merged definition for one agent. */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const agent = await getAgentById(id);
  if (!agent) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ agent });
}

/**
 * PATCH /api/agents/:id — update an existing agent.
 *
 *   - Built-ins: stored as a partial override.
 *   - Customs:   merged into the customs array.
 */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const existing = await getAgentById(id);
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  // Merge incoming patch onto the existing agent so the validator sees the
  // full shape, then re-pull the patch fields back out for storage.
  const b = (body ?? {}) as Record<string, unknown>;
  const merged = {
    ...existing,
    ...b,
    inference: b.inference
      ? { ...(existing.inference ?? {}), ...(b.inference as object) }
      : existing.inference,
    imageInference: b.imageInference
      ? { ...(existing.imageInference ?? {}), ...(b.imageInference as object) }
      : existing.imageInference,
  };
  const parsed = validateAgentInput(merged, {
    id,
    expectCustom: Boolean(existing.custom),
  });
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const updated = await updateAgent(id, parsed.value);
  return NextResponse.json({ agent: updated });
}

/**
 * DELETE /api/agents/:id —
 *   - Custom agent: removed entirely.
 *   - Built-in:     clears the override (i.e. restores defaults).
 */
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const removed = await deleteAgent(id);
  return NextResponse.json({ ok: true, removed });
}
