import { NextResponse } from "next/server";
import { createCampaign, listCampaigns } from "@/lib/store";
import { DEFAULT_PIPELINE } from "@/lib/agents";

export const dynamic = "force-dynamic";

export async function GET() {
  const campaigns = await listCampaigns();
  return NextResponse.json({ campaigns });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = parseBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const campaign = await createCampaign({
    ...parsed.value,
    pipeline: DEFAULT_PIPELINE,
  });
  return NextResponse.json({ campaign }, { status: 201 });
}

type ParseResult =
  | {
      ok: true;
      value: {
        name: string;
        brand: string;
        goal: string;
        audience: string;
        channel: "instagram" | "x" | "tiktok" | "linkedin" | "web";
        tone: "corporate" | "youthful" | "luxury" | "playful";
      };
    }
  | { ok: false; error: string };

function parseBody(body: unknown): ParseResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "body must be an object" };
  }
  const b = body as Record<string, unknown>;
  const requireString = (key: string): string | null =>
    typeof b[key] === "string" && (b[key] as string).trim().length > 0
      ? (b[key] as string).trim()
      : null;

  const name = requireString("name");
  const brand = requireString("brand");
  const goal = requireString("goal");
  const audience = requireString("audience");
  const channel = b.channel as string | undefined;
  const tone = b.tone as string | undefined;

  if (!name) return { ok: false, error: "name is required" };
  if (!brand) return { ok: false, error: "brand is required" };
  if (!goal) return { ok: false, error: "goal is required" };
  if (!audience) return { ok: false, error: "audience is required" };

  const channels = ["instagram", "x", "tiktok", "linkedin", "web"] as const;
  const tones = ["corporate", "youthful", "luxury", "playful"] as const;
  type Channel = (typeof channels)[number];
  type Tone = (typeof tones)[number];

  if (!channel || !channels.includes(channel as Channel)) {
    return { ok: false, error: "channel is invalid" };
  }
  if (!tone || !tones.includes(tone as Tone)) {
    return { ok: false, error: "tone is invalid" };
  }

  return {
    ok: true,
    value: {
      name,
      brand,
      goal,
      audience,
      channel: channel as Channel,
      tone: tone as Tone,
    },
  };
}
