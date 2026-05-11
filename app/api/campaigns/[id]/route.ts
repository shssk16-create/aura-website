import { NextResponse } from "next/server";
import { getCampaign } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const campaign = await getCampaign(id);
  if (!campaign) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ campaign });
}
