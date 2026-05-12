import { NextResponse } from "next/server";
import { deleteKey, listSlotConfig } from "@/lib/secrets";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ slot: string }> },
) {
  const { slot } = await ctx.params;
  if (!(await listSlotConfig()).some((s) => s.name === slot)) {
    return NextResponse.json({ error: "unknown slot" }, { status: 404 });
  }
  const removed = await deleteKey(slot);
  return NextResponse.json({ ok: true, removed });
}
