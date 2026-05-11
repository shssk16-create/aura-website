import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FILENAME_RE = /^[A-Za-z0-9._-]+\.(jpe?g|png|webp)$/i;

/**
 * Serves Designer-generated images saved by the orchestrator under
 * `${AURA_DATA_DIR}/images/`. The `.data` directory is gitignored, so these
 * stay out of the repo. The filename is whitelisted to a safe character set
 * before the path is resolved to prevent traversal.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ name: string }> },
) {
  const { name } = await ctx.params;
  if (!FILENAME_RE.test(name)) {
    return new NextResponse("invalid filename", { status: 400 });
  }

  const dataDir =
    process.env.AURA_DATA_DIR ?? path.join(process.cwd(), ".data");
  const filePath = path.join(dataDir, "images", name);
  try {
    const buf = await fs.readFile(filePath);
    const lower = name.toLowerCase();
    const contentType = lower.endsWith(".png")
      ? "image/png"
      : lower.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return new NextResponse("not found", { status: 404 });
    }
    throw err;
  }
}
