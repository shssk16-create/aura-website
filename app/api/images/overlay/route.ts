import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Returns an SVG preview composing the requested Arabic text on top of an
 * AURA-branded background.
 *
 * In production this endpoint should delegate to `scripts/overlay_arabic.py`
 * (Pillow + arabic-reshaper + python-bidi) running against a FLUX.1 generated
 * background. For v1 / preview environments without GPUs, an SVG is enough
 * to demonstrate the end-to-end UX — RTL text rendering in SVG is handled
 * natively by the browser.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const text = (url.searchParams.get("text") ?? "أورا").slice(0, 80);
  const subtitle = (url.searchParams.get("subtitle") ?? "هالتك الفارقة").slice(0, 120);
  const variant = url.searchParams.get("variant") ?? "default";

  const svg = renderSvg(text, subtitle, variant);
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

function renderSvg(headline: string, subtitle: string, variant: string): string {
  const palette =
    variant === "dark"
      ? { from: "#0B1220", to: "#0F172A", text: "#F4F7FB", accent: "#58A8B4" }
      : { from: "#438FB3", to: "#58A8B4", text: "#FFFFFF", accent: "#0F172A" };

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" direction="rtl">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.from}" />
      <stop offset="100%" stop-color="${palette.to}" />
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="20%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.35)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect width="1200" height="630" fill="url(#glow)" />
  <g font-family="'Cairo','DIN Next LT Arabic',sans-serif" fill="${palette.text}">
    <text x="80" y="120" font-size="28" font-weight="600" opacity="0.85" direction="rtl" text-anchor="start">AURA AI</text>
    <text x="80" y="320" font-size="84" font-weight="900" direction="rtl" text-anchor="start">${escapeXml(headline)}</text>
    <text x="80" y="400" font-size="36" font-weight="500" opacity="0.9" direction="rtl" text-anchor="start">${escapeXml(subtitle)}</text>
    <rect x="80" y="470" width="220" height="64" rx="32" fill="${palette.accent}" />
    <text x="190" y="510" font-size="24" font-weight="700" fill="${palette.from}" text-anchor="middle" direction="rtl">ابدأ الآن</text>
  </g>
</svg>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
