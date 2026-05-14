/**
 * GET /api/og — Open Graph image generator.
 *
 * @scaffold — the production path uses `ImageResponse` from `next/og` (the
 * built-in Satori bridge) to render an Arabic OG card with the campaign's
 * headline. Satori's `opentype.js` GSUB-lookup patches (2025+) make this
 * viable for RTL Arabic, but rendering quality depends on a real Arabic
 * font being passed at request time — there is no implicit system-font
 * fallback in Satori. We fall back to a plain SVG when `next/og` is
 * unavailable in the current runtime (e.g. older Node).
 *
 * Query params:
 *   - title:    Arabic headline (required)
 *   - subtitle: optional subhead
 *   - brand:    brand name shown in the corner
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title")?.trim() ?? "أورا للذكاء التسويقي";
  const subtitle = searchParams.get("subtitle")?.trim() ?? "";
  const brand = searchParams.get("brand")?.trim() ?? "AURA";

  const nextOg = await tryLoadNextOg();
  if (nextOg) {
    return nextOg.render({ title, subtitle, brand });
  }
  return svgFallback({ title, subtitle, brand });
}

async function tryLoadNextOg(): Promise<
  | {
      render: (args: { title: string; subtitle: string; brand: string }) => Response;
    }
  | null
> {
  try {
    const mod = (await import("next/og").catch(() => null)) as
      | typeof import("next/og")
      | null;
    if (!mod) return null;
    const { ImageResponse } = mod;
    return {
      render: ({ title, subtitle, brand }) =>
        new ImageResponse(
          (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 80,
                background:
                  "linear-gradient(135deg, #58A8B4 0%, #438FB3 100%)",
                color: "#ffffff",
                fontFamily: "Cairo, 'IBM Plex Sans Arabic', sans-serif",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: 2,
                }}
              >
                {brand}
              </div>
              <div
                dir="rtl"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  textAlign: "right",
                  gap: 16,
                }}
              >
                <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1.1 }}>
                  {title}
                </div>
                {subtitle ? (
                  <div style={{ fontSize: 36, fontWeight: 500, opacity: 0.9 }}>
                    {subtitle}
                  </div>
                ) : null}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  fontSize: 24,
                  opacity: 0.85,
                }}
              >
                aura.ai
              </div>
            </div>
          ),
          { width: 1200, height: 630 },
        ),
    };
  } catch {
    return null;
  }
}

function svgFallback({
  title,
  subtitle,
  brand,
}: {
  title: string;
  subtitle: string;
  brand: string;
}): Response {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#58A8B4"/>
      <stop offset="100%" stop-color="#438FB3"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="80" y="120" fill="#fff" font-size="28" font-weight="700" font-family="Cairo, sans-serif" letter-spacing="2">${escapeXml(brand)}</text>
  <text x="1120" y="380" fill="#fff" font-size="96" font-weight="900" font-family="Cairo, sans-serif" text-anchor="end" direction="rtl" unicode-bidi="bidi-override">${escapeXml(title)}</text>
  ${
    subtitle
      ? `<text x="1120" y="450" fill="#fff" font-size="36" font-weight="500" font-family="Cairo, sans-serif" text-anchor="end" direction="rtl" unicode-bidi="bidi-override" opacity="0.9">${escapeXml(subtitle)}</text>`
      : ""
  }
  <text x="1120" y="580" fill="#fff" font-size="24" font-family="Cairo, sans-serif" text-anchor="end" opacity="0.85">aura.ai</text>
</svg>`;
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
