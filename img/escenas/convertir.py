#!/usr/local/bin/python3
"""raw/*.{jpg,png} (Gemini 2752x1536) → <name>.webp at 1920 wide for the chapter backgrounds."""
import glob, os
from PIL import Image
R = os.path.dirname(os.path.abspath(__file__))
for f in glob.glob(os.path.join(R, "raw", "*")):
    n = os.path.splitext(os.path.basename(f))[0]
    im = Image.open(f).convert("RGB"); im.thumbnail((1920, 1920))
    im.save(os.path.join(R, n + ".webp"), quality=80); print(n, im.size)
