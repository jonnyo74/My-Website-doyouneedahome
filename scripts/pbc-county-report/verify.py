"""Automated checks for the generated report. Visual inspection of previews/ is still required."""
from __future__ import annotations
import subprocess, sys, tempfile
from pathlib import Path

import cv2
import pdfplumber

LETTER = (612, 792)
FOOTER_TOP = 792 - 0.38 * 72 - 22   # footer rule y (pt from top), minus its padding/text box


def verify(pdf: Path, expected_links: list[str], qr_expected: str | None) -> int:
    fails, notes = [], []
    with pdfplumber.open(pdf) as doc:
        n = len(doc.pages)
        if not 5 <= n <= 6:
            fails.append(f"page count {n}, expected 5-6")
        uris = set()
        for i, p in enumerate(doc.pages, 1):
            if (round(p.width), round(p.height)) != LETTER:
                fails.append(f"page {i} size {p.width}x{p.height}, expected US Letter")
            for h in p.hyperlinks:
                uris.add(h.get("uri"))
            words = p.extract_words()
            off = [w["text"] for w in words if w["x0"] < 0 or w["x1"] > p.width + 0.5 or w["bottom"] > p.height + 0.5 or w["top"] < -0.5]
            if off:
                fails.append(f"page {i}: text outside page bounds: {off[:6]}")
            # overlapping words = text drawn on top of other text
            for j, w1 in enumerate(words):
                for w2 in words[j + 1:j + 60]:
                    ox = min(w1["x1"], w2["x1"]) - max(w1["x0"], w2["x0"])
                    oy = min(w1["bottom"], w2["bottom"]) - max(w1["top"], w2["top"])
                    if ox > 1.5 and oy > 2:
                        fails.append(f"page {i}: overlapping text {w1['text']!r} / {w2['text']!r}")
            # interior pages: nothing may sit on or below the footer rule except the footer row itself
            if 2 <= i <= 5:
                rules = [r for r in (p.lines + p.rects) if (r["x1"] - r["x0"]) > 400 and r["top"] > p.height - 90]
                if not rules:
                    fails.append(f"page {i}: footer rule not found")
                else:
                    ry = min(r["top"] for r in rules)
                    bad = [w["text"] for w in words if w["bottom"] > ry - 1 and not (ry < w["top"] < ry + 16)]
                    if bad:
                        fails.append(f"page {i}: content runs into footer: {bad[:8]}")
        for u in expected_links:
            (notes if u in uris else fails).append(f"link {'OK' if u in uris else 'MISSING'}: {u}")
        notes.append(f"all link targets: {sorted(x for x in uris if x)}")

    fonts = subprocess.run(["pdffonts", str(pdf)], capture_output=True, text=True).stdout
    for bad in ("DejaVu", "Liberation", "Bitstream", "FreeSans"):
        if bad in fonts:
            fails.append(f"fallback font embedded: {bad} (a glyph is missing from Inter/Playfair)")
    if " no " in "".join(l[60:] for l in fonts.splitlines()[2:]).replace("yes", ""):
        pass

    if qr_expected:
        with tempfile.TemporaryDirectory() as td:
            subprocess.run(["pdftoppm", "-r", "200", "-f", str(n), "-l", str(n), "-png", str(pdf), f"{td}/q"], check=True)
            img = cv2.imread(str(next(Path(td).glob("q*.png"))))
            val, _, _ = cv2.QRCodeDetector().detectAndDecode(img)
            (notes if val == qr_expected else fails).append(f"QR decode: {val!r}")

    for x in notes: print("  ok  ", x)
    for x in fails: print("  FAIL", x)
    print("VERIFY:", "PASS" if not fails else f"{len(fails)} problem(s)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(verify(Path(sys.argv[1]), [], None))
