# Editable Arabic Typography Pipeline

Global generative models (ChatGPT Images 2.0, FLUX 2, etc.) can now render
Arabic glyphs, but they **bake** the text into the pixel buffer. If a
merchant wants to fix a typo or update a price, the entire image must be
regenerated.

Aura keeps the Arabic copy as an **editable text layer** that is rendered
deterministically on top of a clean, pre-composed background.

## Stages

### 1. Background generation

`lib/edify.ts` calls **NVIDIA Edify Image** with the merchant's raw photo
passed as a ControlNet `reference_image` anchor. The text prompt instructs
the model to leave a clean, blank label surface (e.g. *"a matte black
label with no text"*). The product geometry is locked; only the scene
around it changes.

### 2. Label detection

The vision agent (`lib/vision.ts`, model `nvidia/nemotron-3-nano-omni-30b`)
emits a JSON payload containing the four corner coordinates `(x, y)` of
the blank label surface in normalised image coordinates.

### 3. Text shaping (HarfBuzz WASM)

`lib/typography/shape.ts` loads `harfbuzzjs` (a WebAssembly port of the
HarfBuzz shaping engine used by Chrome, Android, and Photoshop) and:

1. Loads an Arabic OpenType font (e.g. **Cairo**, **IBM Plex Sans Arabic**,
   or a custom KSA-brand font).
2. Shapes the Unicode string using `GSUB` + `GPOS` tables, including
   Context-3 substitutions for cursive Arabic ligatures.
3. Applies a BiDi pass to map logical → visual order (right-to-left).
4. Emits glyph runs `{ glyphId, xAdvance, yAdvance, xOffset, yOffset }`.

The runs are rendered onto a transparent 2D HTML Canvas / SVG layer with
the correct typographic colour and weight.

### 4. Perspective warp (OpenCV)

`lib/typography/warp.ts` invokes `scripts/typography_pipeline.py`. The
Python sidecar:

1. Reads the flat 2D text canvas + the four label corners.
2. Computes a homography matrix with
   `cv2.getPerspectiveTransform(src, dst)`.
3. Warps the text with `cv2.warpPerspective(image, M, dsize)`.
4. Alpha-blends the warped text onto the background image, matching pixel
   intensity and adding subtle noise so the result does not look pasted.

### 5. Re-edit loop

The merchant edits the copy in the dashboard → `app/api/typography/route.ts`
re-shapes and re-warps → the background image is reused → response time
is sub-second instead of the 10–30s diffusion render. The base image is
cached by SHA in the campaign record.

## Why HarfBuzz WASM

Naïve approaches that fail:

- `<canvas>.fillText(arabicString)` — depends entirely on the runtime's
  font system; renders inconsistent glyph shapes between Chrome, Safari,
  serverless Node, and Edge runtimes.
- `puppeteer-screenshot-an-html-page` — heavy, slow, and still misses
  glyphs without explicit font loading.
- `node-canvas` — uses Cairo + Pango; works but ships a 100MB binary that
  cold-starts poorly in serverless.

HarfBuzz WASM is ~250KB, runs everywhere, and produces pixel-identical
shaping across Node, Deno, Cloudflare Workers, and the browser. The same
engine powers the OG image route (`app/api/og/route.tsx`) via Satori's
recent `GSUB` patches.

## Reference: OG image route

`app/api/og/route.tsx` uses `@vercel/og` (Satori under the hood). Earlier
versions of Satori dropped Arabic ligatures and mirrored text incorrectly;
the upstream `opentype.js` GSUB-lookup patch (2025) fixes this. Aura
loads a known-good Arabic font at request time and passes it explicitly
to Satori — there is no implicit system-font fallback.

## Reference implementation

The Python sidecar (`scripts/typography_pipeline.py`) is the canonical
reference for the warp + blend step. The WASM path in
`lib/typography/warp.ts` is the production path; the sidecar exists for
local debugging and for environments where the WASM bundle cannot run.
