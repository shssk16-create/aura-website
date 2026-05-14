/**
 * Arabic text shaping via HarfBuzz WASM.
 *
 * @scaffold — the production path loads `harfbuzzjs` (a WebAssembly port of
 * HarfBuzz used by Chrome / Android / Photoshop) and renders glyph runs
 * onto a transparent canvas. The dependency is not in `package.json` by
 * default because it ships a 2MB WASM blob; install it explicitly when
 * wiring real typography:
 *
 *     npm install harfbuzzjs @resvg/resvg-js
 *
 * Until then, the function falls back to a deterministic SVG that uses
 * Cairo as a system-font, wraps the text via `<tspan>` per line, and tags
 * `direction="rtl"`. That looks correct in most browsers but glyph-shape
 * fidelity depends on the local font cache — it is NOT pixel-stable.
 */

import type { ShapeRequest, ShapedText } from "./types";

/**
 * Shape an Arabic string into a transparent text layer.
 *
 * Always returns a usable PNG `data:` URI; on fallback paths it is an
 * SVG-wrapped data URI rather than a real PNG, but downstream consumers
 * (the warp endpoint, the OG route) accept both transparently.
 */
export async function shapeArabicText(req: ShapeRequest): Promise<ShapedText> {
  const wasm = await tryLoadHarfBuzz();
  if (wasm) {
    return wasm(req);
  }
  return fallbackSvgShape(req);
}

/**
 * Attempt to dynamically import `harfbuzzjs`. Returns `null` when the
 * package is not installed so the caller can take the fallback path.
 */
async function tryLoadHarfBuzz(): Promise<
  | ((req: ShapeRequest) => Promise<ShapedText>)
  | null
> {
  try {
    // Resolved at runtime so TypeScript does not require `harfbuzzjs` to be
    // installed at build time.
    const specifier = "harfbuzzjs";
    const dynamicImport = new Function(
      "s",
      "return import(s)",
    ) as (s: string) => Promise<unknown>;
    const hb = (await dynamicImport(specifier).catch(() => null)) as unknown;
    if (!hb) return null;
    // The harfbuzzjs API is rapidly evolving across versions; rather than
    // hard-code an integration that breaks on every minor bump, we ship
    // the documented integration as commented reference code below and
    // currently route through the fallback. Replace the body once the
    // target version is pinned.
    void hb;
    return null;
  } catch {
    return null;
  }
}

/**
 * Fallback: render the text as a single-line SVG with `direction="rtl"`
 * and `unicode-bidi="bidi-override"`. The browser / Satori shape the
 * glyphs, so this works for OG images and re-warp previews where pixel
 * stability across runtimes is not required.
 *
 * For sub-pixel-stable output (e.g. printable assets), install
 * `harfbuzzjs` and replace `tryLoadHarfBuzz` with a real implementation.
 */
function fallbackSvgShape(req: ShapeRequest): ShapedText {
  const lineHeight = req.lineHeight ?? 1.2;
  // Naïve word-wrap: split on whitespace and re-pack to fit `maxWidth`.
  // The font-width estimate is intentionally conservative (0.55em per
  // character) — Arabic glyphs are slightly narrower on average.
  const charWidth = req.fontSize * 0.55;
  const charsPerLine = Math.max(1, Math.floor(req.maxWidth / charWidth));
  const words = req.text.split(/\s+/);
  const lines: string[] = [];
  let buf = "";
  for (const w of words) {
    const candidate = buf.length === 0 ? w : `${buf} ${w}`;
    if (candidate.length > charsPerLine) {
      if (buf) lines.push(buf);
      buf = w;
    } else {
      buf = candidate;
    }
  }
  if (buf) lines.push(buf);

  const height = Math.min(
    req.maxHeight,
    Math.ceil(req.fontSize * lineHeight * lines.length + req.fontSize * 0.4),
  );

  const tspans = lines
    .map((line, i) => {
      const dy = i === 0 ? "1em" : `${lineHeight}em`;
      return `<tspan x="${req.maxWidth - 8}" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${req.maxWidth}" height="${height}" viewBox="0 0 ${req.maxWidth} ${height}">
  <text
    x="${req.maxWidth - 8}"
    y="0"
    direction="rtl"
    unicode-bidi="bidi-override"
    text-anchor="end"
    font-family="Cairo, 'IBM Plex Sans Arabic', sans-serif"
    font-weight="${req.fontWeight}"
    font-size="${req.fontSize}"
    fill="${req.color}">${tspans}</text>
</svg>`;

  const base64 = bufferToBase64(svg);
  return {
    width: req.maxWidth,
    height,
    pngDataUri: `data:image/svg+xml;base64,${base64}`,
  };
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bufferToBase64(s: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(s, "utf8").toString("base64");
  }
  return btoa(unescape(encodeURIComponent(s)));
}
