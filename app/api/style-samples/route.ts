import { NextResponse } from "next/server";
import {
  createSample,
  listSamples,
  type ChannelFilter,
  type ToneFilter,
} from "@/lib/style";
import type { AgentId } from "@/lib/agents";

export const dynamic = "force-dynamic";

const CHANNELS: ChannelFilter[] = [
  "any",
  "instagram",
  "x",
  "tiktok",
  "linkedin",
  "web",
];
const TONES: ToneFilter[] = [
  "any",
  "corporate",
  "youthful",
  "luxury",
  "playful",
];
const AGENT_IDS: AgentId[] = [
  "manager",
  "strategist",
  "copywriter",
  "analyst",
  "designer",
  "social",
  "seo",
  "video",
];

export async function GET() {
  const samples = await listSamples();
  return NextResponse.json({ samples });
}

export async function POST(req: Request) {
  let body: {
    brand?: string;
    channel?: string;
    tone?: string;
    text?: string;
    label?: string;
    agents?: string[];
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const brand = body.brand?.trim();
  const text = body.text?.trim();
  const channel = (body.channel ?? "any") as ChannelFilter;
  const tone = (body.tone ?? "any") as ToneFilter;
  const label = body.label?.trim() ?? "";
  const agents =
    body.agents?.filter((a): a is AgentId =>
      AGENT_IDS.includes(a as AgentId),
    ) ?? undefined;

  if (!brand || !text) {
    return NextResponse.json(
      { error: "brand and text are required" },
      { status: 400 },
    );
  }
  if (!CHANNELS.includes(channel)) {
    return NextResponse.json({ error: "invalid channel" }, { status: 400 });
  }
  if (!TONES.includes(tone)) {
    return NextResponse.json({ error: "invalid tone" }, { status: 400 });
  }

  const sample = await createSample({
    brand,
    channel,
    tone,
    text,
    label,
    agents,
  });
  return NextResponse.json({ sample });
}
