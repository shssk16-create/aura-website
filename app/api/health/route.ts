import { NextResponse } from "next/server";
import { getAgents } from "@/lib/registry";
import { isAgentConnectedAsync } from "@/lib/secrets";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Lightweight liveness/readiness probe. Returns a compact JSON snapshot of:
 *
 *   - service name + version
 *   - total agents registered (defaults + customs)
 *   - how many have a usable inference path right now
 *   - a per-agent flag so monitoring dashboards can spot which providers
 *     are silently in stub mode
 *
 * Always responds 200 — agents without keys are not an error, they fall
 * back to deterministic stubs. Use this for uptime checks and dashboards.
 */
export async function GET() {
  const agents = await getAgents();
  const flags = await Promise.all(agents.map((a) => isAgentConnectedAsync(a)));
  const connected = agents.map((a, i) => ({
    id: a.id,
    nameEn: a.nameEn,
    connected: flags[i],
    model: a.model,
  }));
  return NextResponse.json({
    ok: true,
    service: "aura-website",
    version: "0.1.0",
    timestamp: new Date().toISOString(),
    agents: {
      total: agents.length,
      connected: flags.filter(Boolean).length,
      detail: connected,
    },
  });
}
