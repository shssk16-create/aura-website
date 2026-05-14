/**
 * POST /api/typography
 *
 * Re-render the editable Arabic text layer on top of a background image
 * without re-running the diffusion model. This is the endpoint the
 * dashboard hits every time the merchant edits the copy.
 *
 * Request body (JSON):
 *   {
 *     backgroundDataUri: string;       // data:image/png;base64,...
 *     headline: string;                // Arabic text
 *     subhead?: string;                // optional second line
 *     fontSize?: number;               // default 96
 *     fontWeight?: 400|500|600|700|800|900;  // default 800
 *     color?: string;                  // hex, default #ffffff
 *     polygon: [[number,number],[number,number],[number,number],[number,number]];
 *     imageWidth: number;
 *     imageHeight: number;
 *   }
 *
 * Response (JSON):
 *   { imageDataUri: string }   // final composited image
 */

import { NextResponse } from "next/server";
import { shapeArabicText } from "@/lib/typography/shape";
import { warpAndComposite } from "@/lib/typography/warp";
import type { LabelSurface } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface TypographyPayload {
  backgroundDataUri?: unknown;
  headline?: unknown;
  subhead?: unknown;
  fontSize?: unknown;
  fontWeight?: unknown;
  color?: unknown;
  polygon?: unknown;
  imageWidth?: unknown;
  imageHeight?: unknown;
}

export async function POST(req: Request) {
  let body: TypographyPayload;
  try {
    body = (await req.json()) as TypographyPayload;
  } catch {
    return NextResponse.json(
      { error: "expected JSON body" },
      { status: 400 },
    );
  }

  const validation = validate(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  const v = validation.value;

  // Estimate the bounding box from the polygon. We pick the longest side
  // as `maxWidth` and the perpendicular side as `maxHeight`.
  const [p0, p1, , p3] = v.polygon;
  const widthPx = Math.hypot(
    (p1[0] - p0[0]) * v.imageWidth,
    (p1[1] - p0[1]) * v.imageHeight,
  );
  const heightPx = Math.hypot(
    (p3[0] - p0[0]) * v.imageWidth,
    (p3[1] - p0[1]) * v.imageHeight,
  );

  const shaped = await shapeArabicText({
    text: v.subhead ? `${v.headline}\n${v.subhead}` : v.headline,
    fontSize: v.fontSize ?? 96,
    fontWeight: v.fontWeight ?? 800,
    color: v.color ?? "#ffffff",
    maxWidth: Math.max(64, Math.round(widthPx)),
    maxHeight: Math.max(64, Math.round(heightPx)),
  });

  const result = await warpAndComposite({
    backgroundDataUri: v.backgroundDataUri,
    textDataUri: shaped.pngDataUri,
    destination: v.polygon,
    imageWidth: v.imageWidth,
    imageHeight: v.imageHeight,
  });

  return NextResponse.json(result);
}

interface ValidPayload {
  backgroundDataUri: string;
  headline: string;
  subhead?: string;
  fontSize?: number;
  fontWeight?: 400 | 500 | 600 | 700 | 800 | 900;
  color?: string;
  polygon: LabelSurface["polygon"];
  imageWidth: number;
  imageHeight: number;
}

function validate(
  body: TypographyPayload,
):
  | { ok: true; value: ValidPayload }
  | { ok: false; error: string } {
  if (typeof body.backgroundDataUri !== "string")
    return { ok: false, error: "backgroundDataUri must be a string" };
  if (!body.backgroundDataUri.startsWith("data:image/"))
    return { ok: false, error: "backgroundDataUri must be an image data URI" };
  if (typeof body.headline !== "string" || !body.headline.trim())
    return { ok: false, error: "headline is required" };
  if (typeof body.imageWidth !== "number" || body.imageWidth <= 0)
    return { ok: false, error: "imageWidth must be a positive number" };
  if (typeof body.imageHeight !== "number" || body.imageHeight <= 0)
    return { ok: false, error: "imageHeight must be a positive number" };
  if (!Array.isArray(body.polygon) || body.polygon.length !== 4)
    return { ok: false, error: "polygon must be an array of 4 corner points" };

  const polygon: [number, number][] = [];
  for (const corner of body.polygon) {
    if (
      !Array.isArray(corner) ||
      corner.length !== 2 ||
      typeof corner[0] !== "number" ||
      typeof corner[1] !== "number"
    ) {
      return { ok: false, error: "polygon corners must be [number, number]" };
    }
    polygon.push([corner[0], corner[1]]);
  }

  const fontSize =
    typeof body.fontSize === "number" && body.fontSize > 0
      ? body.fontSize
      : undefined;
  const fontWeight = isFontWeight(body.fontWeight) ? body.fontWeight : undefined;
  const color =
    typeof body.color === "string" && /^#?[0-9a-fA-F]{3,8}$/.test(body.color)
      ? body.color.startsWith("#")
        ? body.color
        : `#${body.color}`
      : undefined;

  return {
    ok: true,
    value: {
      backgroundDataUri: body.backgroundDataUri,
      headline: body.headline.trim(),
      subhead:
        typeof body.subhead === "string" && body.subhead.trim()
          ? body.subhead.trim()
          : undefined,
      fontSize,
      fontWeight,
      color,
      polygon: polygon as LabelSurface["polygon"],
      imageWidth: body.imageWidth,
      imageHeight: body.imageHeight,
    },
  };
}

function isFontWeight(
  value: unknown,
): value is 400 | 500 | 600 | 700 | 800 | 900 {
  return (
    typeof value === "number" &&
    [400, 500, 600, 700, 800, 900].includes(value)
  );
}
