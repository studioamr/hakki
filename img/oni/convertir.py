#!/usr/local/bin/python3
"""raw/oni-*.png from Gemini → cards in img/coleccion (1100px) and scenes in img/escenas (1920px).
Scenes are the wide ones (oni-castle, oni-hellgate, oni-lake, oni-gathering); merch goes to img/merch."""
import glob, os
from PIL import Image
R = os.path.dirname(os.path.abspath(__file__)); IMG = os.path.dirname(R)
SCENES = {"oni-castle", "oni-hellgate", "oni-lake", "oni-gathering"}
MERCH = {"oni-cap", "oni-tee", "oni-hoodie"}
for f in sorted(glob.glob(os.path.join(R, "raw", "*.png"))):
    n = os.path.splitext(os.path.basename(f))[0]
    im = Image.open(f).convert("RGB")
    if n in MERCH: im.thumbnail((900, 900)); out = os.path.join(IMG, "merch", n + ".webp"); q = 86
    elif n in SCENES: im.thumbnail((1920, 1920)); out = os.path.join(IMG, "escenas", n + ".webp"); q = 80
    else: im.thumbnail((1100, 1100)); out = os.path.join(IMG, "coleccion", n + ".webp"); q = 88
    im.save(out, quality=q); print(n, im.size)
