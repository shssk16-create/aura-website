import { NextResponse } from "next/server";
import {
  createCustomAgent,
  getAgents,
  validateAgentInput,
} from "@/lib/registry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET — return the live merged agent list (defaults + overrides + customs). */
export async function GET() {
  const agents = await getAgents();
  return NextResponse.json({ agents });
}

/**
 * POST — create a new custom agent.
 *
 *   body: { id, nameAr, nameEn?, descriptionAr?, model?, icon?, accent?,
 *           stage?, pipelineEnabled?, disabled?, inference?, imageInference?,
 *           systemPromptAr?, endpointEnv? }
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const b = (body ?? {}) as Record<string, unknown>;
  const id = typeof b.id === "string" ? b.id.trim() : "";
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  const parsed = validateAgentInput(body, { id, expectCustom: true });
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  try {
    const agent = await createCustomAgent(parsed.value);
    return NextResponse.json({ agent }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 409 },
    );
  }
}
