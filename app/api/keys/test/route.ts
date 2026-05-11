import { NextResponse } from "next/server";
import { pingSlot, listSlotConfig } from "@/lib/secrets";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { slot?: string };
  try {
    body = (await req.json()) as { slot?: string };
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const slot = body.slot?.trim();
  if (!slot) {
    return NextResponse.json({ error: "slot is required" }, { status: 400 });
  }
  if (!listSlotConfig().some((s) => s.name === slot)) {
    return NextResponse.json({ error: "unknown slot" }, { status: 400 });
  }
  const result = await pingSlot(slot);
  return NextResponse.json(result);
}
