import { NextResponse } from "next/server";
import { listMasks, listSlotConfig, setKey } from "@/lib/secrets";

export const dynamic = "force-dynamic";

export async function GET() {
  const [slots, masks] = await Promise.all([
    Promise.resolve(listSlotConfig()),
    listMasks(),
  ]);
  // Strip the ping config; the browser doesn't need (and shouldn't see)
  // raw provider URLs for unrelated keys.
  const slotPublic = slots.map((s) => ({
    name: s.name,
    labelAr: s.labelAr,
    providerLabel: s.providerLabel,
    usedByAr: s.usedByAr,
    pingable: s.ping.kind !== "presence-only",
  }));
  return NextResponse.json({ slots: slotPublic, masks });
}

export async function POST(req: Request) {
  let body: { slot?: string; value?: string };
  try {
    body = (await req.json()) as { slot?: string; value?: string };
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const slot = body.slot?.trim();
  const value = body.value;
  if (!slot || !value) {
    return NextResponse.json(
      { error: "slot and value are required" },
      { status: 400 },
    );
  }
  const known = listSlotConfig().some((s) => s.name === slot);
  if (!known) {
    return NextResponse.json({ error: "unknown slot" }, { status: 400 });
  }
  try {
    const mask = await setKey(slot, value);
    return NextResponse.json({ ok: true, mask });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 },
    );
  }
}
