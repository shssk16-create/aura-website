#!/usr/bin/env python3
"""Overlay Arabic text onto an image using Pillow, arabic-reshaper, and python-bidi.

The 2026 generative models (FLUX.1, SDXL, etc.) still mangle Arabic glyphs —
they render letters disconnected, mirrored, or in the wrong order. The fix
is to let the diffusion model render a background with negative space, then
programmatically print the Arabic copy on top with a real Arabic font.

Usage:

    python scripts/overlay_arabic.py \
        --image background.png \
        --text "هالتك الفارقة في عالم التسويق" \
        --subtitle "أورا تعيد تعريف الإبداع" \
        --output final.png

Dependencies (see scripts/requirements.txt):
    Pillow >= 10
    arabic-reshaper >= 3.0
    python-bidi >= 0.4
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def render(
    image_path: Path,
    output_path: Path,
    headline: str,
    subtitle: str | None,
    font_path: Path | None,
    color: str,
) -> None:
    """Render Arabic text onto the given image and save the result."""
    try:
        from PIL import Image, ImageDraw, ImageFont
        import arabic_reshaper
        from bidi.algorithm import get_display
    except ImportError as exc:  # pragma: no cover - imports surfaced to user
        raise SystemExit(
            f"Missing dependency: {exc.name}. Install via "
            "`pip install -r scripts/requirements.txt`."
        ) from exc

    image = Image.open(image_path).convert("RGBA")
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Resolve a usable Arabic font. The caller can override; otherwise we try
    # a few common locations on Linux/macOS and finally fall back to Pillow's
    # default bitmap font.
    font_candidates = [
        font_path,
        Path("/usr/share/fonts/truetype/cairo/Cairo-Bold.ttf"),
        Path("/usr/share/fonts/cairo/Cairo-Bold.ttf"),
        Path("/Library/Fonts/Cairo-Bold.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
    ]
    headline_font = _load_font(font_candidates, size=max(48, image.height // 10))
    subtitle_font = _load_font(font_candidates, size=max(28, image.height // 22))

    headline_display = get_display(arabic_reshaper.reshape(headline))
    headline_w = draw.textlength(headline_display, font=headline_font)
    x = image.width - headline_w - 80
    y = int(image.height * 0.35)
    draw.text((x, y), headline_display, font=headline_font, fill=color)

    if subtitle:
        sub_display = get_display(arabic_reshaper.reshape(subtitle))
        sub_w = draw.textlength(sub_display, font=subtitle_font)
        sub_x = image.width - sub_w - 80
        sub_y = y + int(headline_font.size * 1.3)
        draw.text((sub_x, sub_y), sub_display, font=subtitle_font, fill=color)

    composed = Image.alpha_composite(image, overlay)
    composed.convert("RGB").save(output_path, quality=92)


def _load_font(candidates, size: int):
    from PIL import ImageFont

    for candidate in candidates:
        if candidate is None:
            continue
        try:
            return ImageFont.truetype(str(candidate), size=size)
        except (OSError, ValueError):
            continue
    return ImageFont.load_default()


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Overlay Arabic text on an image.")
    parser.add_argument("--image", required=True, type=Path, help="Background image path.")
    parser.add_argument("--output", required=True, type=Path, help="Output file path.")
    parser.add_argument("--text", required=True, help="Primary Arabic headline.")
    parser.add_argument("--subtitle", default=None, help="Optional Arabic subtitle.")
    parser.add_argument("--font", type=Path, default=None, help="Path to an Arabic TTF font.")
    parser.add_argument("--color", default="#FFFFFF", help="Text color (hex or name).")
    args = parser.parse_args(argv)

    render(
        image_path=args.image,
        output_path=args.output,
        headline=args.text,
        subtitle=args.subtitle,
        font_path=args.font,
        color=args.color,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
