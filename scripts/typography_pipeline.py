#!/usr/bin/env python3
"""Aura typography pipeline — warp a flat Arabic text layer onto a product
label surface and alpha-blend the result onto the background image.

This is the reference implementation invoked by `lib/typography/warp.ts`
via a subprocess. It is intentionally minimal — the heavy text shaping
happens upstream in HarfBuzz WASM (or the SVG fallback) so this script
only needs to do the perspective transform + alpha blend.

Usage:

    python scripts/typography_pipeline.py \
        --background background.png \
        --text text.png \
        --corners "x1,y1;x2,y2;x3,y3;x4,y4" \
        --output final.png

Dependencies (see scripts/requirements.txt):
    numpy >= 1.26
    opencv-python >= 4.10
    Pillow >= 10
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def parse_corners(spec: str) -> list[tuple[int, int]]:
    points: list[tuple[int, int]] = []
    for chunk in spec.split(";"):
        chunk = chunk.strip()
        if not chunk:
            continue
        x_str, y_str = chunk.split(",")
        points.append((int(float(x_str)), int(float(y_str))))
    if len(points) != 4:
        raise SystemExit(
            f"expected 4 corner points, got {len(points)}: {spec!r}"
        )
    return points


def warp_and_composite(
    background_path: Path,
    text_path: Path,
    corners: list[tuple[int, int]],
    output_path: Path,
) -> None:
    try:
        import cv2
        import numpy as np
    except ImportError as exc:  # pragma: no cover — surfaced to the user
        raise SystemExit(
            f"Missing dependency: {exc.name}. Install via "
            "`pip install -r scripts/requirements.txt`."
        ) from exc

    bg = cv2.imread(str(background_path), cv2.IMREAD_UNCHANGED)
    if bg is None:
        raise SystemExit(f"failed to read background: {background_path}")
    # Promote to RGBA so the alpha-blend below works uniformly.
    if bg.shape[2] == 3:
        bg = cv2.cvtColor(bg, cv2.COLOR_BGR2BGRA)

    txt = cv2.imread(str(text_path), cv2.IMREAD_UNCHANGED)
    if txt is None:
        raise SystemExit(f"failed to read text overlay: {text_path}")
    if txt.shape[2] == 3:
        txt = cv2.cvtColor(txt, cv2.COLOR_BGR2BGRA)

    h_txt, w_txt = txt.shape[:2]
    h_bg, w_bg = bg.shape[:2]

    # Source corners are the four corners of the flat text canvas.
    src = np.float32(
        [[0, 0], [w_txt, 0], [w_txt, h_txt], [0, h_txt]]
    )
    # Destination corners come from the vision agent — clockwise from
    # top-left.
    dst = np.float32(corners)

    matrix = cv2.getPerspectiveTransform(src, dst)
    warped = cv2.warpPerspective(
        txt,
        matrix,
        (w_bg, h_bg),
        flags=cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_TRANSPARENT,
    )

    # Alpha-blend warped text over the background. We pick out the alpha
    # channel of the warped layer and mix per-pixel.
    bg_rgb = bg[:, :, :3].astype(np.float32)
    warp_rgb = warped[:, :, :3].astype(np.float32)
    alpha = (warped[:, :, 3].astype(np.float32) / 255.0)[:, :, None]
    composited = bg_rgb * (1.0 - alpha) + warp_rgb * alpha
    out = np.dstack([composited.astype(np.uint8), bg[:, :, 3]])

    cv2.imwrite(str(output_path), out)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Warp and composite an Arabic text overlay onto a product image."
    )
    parser.add_argument("--background", required=True, type=Path)
    parser.add_argument("--text", required=True, type=Path)
    parser.add_argument(
        "--corners",
        required=True,
        help='Destination corners, e.g. "x1,y1;x2,y2;x3,y3;x4,y4" '
        "(clockwise from top-left).",
    )
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args(argv)

    warp_and_composite(
        background_path=args.background,
        text_path=args.text,
        corners=parse_corners(args.corners),
        output_path=args.output,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
