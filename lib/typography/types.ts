/**
 * Shared types for the deterministic Arabic typography pipeline. See
 * `docs/TYPOGRAPHY.md` for the full stage diagram.
 */

import type { LabelSurface } from "../supabase/types";

export interface ShapedText {
  /** Pixel width of the rendered text after shaping. */
  width: number;
  /** Pixel height. */
  height: number;
  /** Transparent PNG as a `data:image/png;base64,...` URI. */
  pngDataUri: string;
}

export interface ShapeRequest {
  /** Arabic text to shape. */
  text: string;
  /** Font weight + size + family. */
  fontSize: number;
  fontWeight: 400 | 500 | 600 | 700 | 800 | 900;
  /** Hex colour. */
  color: string;
  /** Optional explicit font URL (overrides the bundled Cairo). */
  fontUrl?: string;
  /** Bounding box that the text must fit inside. */
  maxWidth: number;
  maxHeight: number;
  /** Optional line height multiplier. Default 1.2. */
  lineHeight?: number;
}

export interface WarpRequest {
  /** Base image (background) to composite onto. */
  backgroundDataUri: string;
  /** Flat 2D text canvas to warp. */
  textDataUri: string;
  /** Four corners of the destination label surface, in image-pixel coords. */
  destination: LabelSurface["polygon"];
  /** Width/height of the base image, used to denormalise the polygon. */
  imageWidth: number;
  imageHeight: number;
}

export interface WarpResult {
  /** Final composited image. */
  imageDataUri: string;
}
