/**
 * POST /api/products
 *
 * Ingest a raw product upload, run the vision agent, and persist the
 * product record. Body is JSON (no multipart streaming for v1 — the
 * client base64-encodes the image before posting). Production should
 * switch to a Supabase signed-upload URL.
 *
 * Request:
 *   {
 *     accountId: string;       // tenant id
 *     displayName: string;
 *     imageDataUri: string;    // data:image/...;base64,...
 *     hint?: string;
 *   }
 *
 * Response:
 *   {
 *     id: string;              // product id
 *     visionMetadata: VisionMetadata;
 *   }
 *
 * GET /api/products?accountId=...  → list products for a tenant.
 */

import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { analyseProduct } from "@/lib/vision";
import type { ProductRow, VisionMetadata } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const DATA_DIR =
  process.env.AURA_DATA_DIR ?? path.join(process.cwd(), ".data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const PRODUCT_IMAGES_DIR = path.join(DATA_DIR, "products");

interface PostBody {
  accountId?: unknown;
  displayName?: unknown;
  imageDataUri?: unknown;
  hint?: unknown;
}

export async function POST(req: Request) {
  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "expected JSON body" }, { status: 400 });
  }

  const valid = validate(body);
  if (!valid.ok) {
    return NextResponse.json({ error: valid.error }, { status: 400 });
  }
  const v = valid.value;

  await fs.mkdir(PRODUCT_IMAGES_DIR, { recursive: true });
  const id = crypto.randomUUID();
  const ext = extensionFromDataUri(v.imageDataUri);
  const storagePath = path.join(PRODUCT_IMAGES_DIR, `${id}.${ext}`);
  await fs.writeFile(storagePath, decodeDataUri(v.imageDataUri));

  // The vision agent normally takes a public URL. For local dev we pass
  // the data URI directly; the call falls back to the deterministic stub
  // when the key is missing.
  const visionMetadata: VisionMetadata = await analyseProduct({
    imageUrl: v.imageDataUri,
    hint: v.hint,
  });

  const now = new Date().toISOString();
  const product: ProductRow = {
    id,
    account_id: v.accountId,
    display_name: v.displayName,
    raw_storage_path: storagePath,
    vision_metadata: visionMetadata,
    created_at: now,
    updated_at: now,
  };

  await persist(product);

  return NextResponse.json({ id, visionMetadata });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");
  const all = await readAll();
  const filtered = accountId
    ? all.filter((p) => p.account_id === accountId)
    : all;
  return NextResponse.json({ products: filtered });
}

interface Valid {
  accountId: string;
  displayName: string;
  imageDataUri: string;
  hint?: string;
}

function validate(
  body: PostBody,
): { ok: true; value: Valid } | { ok: false; error: string } {
  if (typeof body.accountId !== "string" || !body.accountId.trim()) {
    return { ok: false, error: "accountId is required" };
  }
  if (typeof body.displayName !== "string" || !body.displayName.trim()) {
    return { ok: false, error: "displayName is required" };
  }
  if (
    typeof body.imageDataUri !== "string" ||
    !body.imageDataUri.startsWith("data:image/")
  ) {
    return { ok: false, error: "imageDataUri must be an image data URI" };
  }
  return {
    ok: true,
    value: {
      accountId: body.accountId.trim(),
      displayName: body.displayName.trim(),
      imageDataUri: body.imageDataUri,
      hint: typeof body.hint === "string" ? body.hint : undefined,
    },
  };
}

function extensionFromDataUri(uri: string): string {
  const m = uri.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,/);
  if (!m) return "bin";
  const t = m[1].toLowerCase();
  if (t === "jpeg") return "jpg";
  return t;
}

function decodeDataUri(uri: string): Buffer {
  const m = uri.match(/^data:[^;]+;base64,(.*)$/);
  if (!m) throw new Error("decodeDataUri: expected base64 data URI");
  return Buffer.from(m[1], "base64");
}

async function persist(product: ProductRow): Promise<void> {
  const all = await readAll();
  all.unshift(product);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(all, null, 2), "utf8");
}

async function readAll(): Promise<ProductRow[]> {
  try {
    const raw = await fs.readFile(PRODUCTS_FILE, "utf8");
    return JSON.parse(raw) as ProductRow[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}
