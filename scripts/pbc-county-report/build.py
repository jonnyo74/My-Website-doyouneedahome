#!/usr/bin/env python3
"""
Palm Beach County Market Report — PDF lead-magnet builder (DO Homes Group).

    python3 build.py                                   # default: August 2026
    python3 build.py --data data/pbc-market-2026-09.json \
                     --narrative data/narrative-2026-09.json

Pipeline: market data JSON + narrative JSON  ->  Jinja2 HTML (template/report.html.j2)
          ->  WeasyPrint  ->  US Letter PDF  ->  per-page PNG previews + automated checks.

Requires: pip install weasyprint jinja2 "qrcode[pil]" opencv-python-headless pdfplumber
          poppler-utils (pdftoppm) for previews.

Monthly update:
  1. Copy data/pbc-market-YYYY-MM.json, enter the new raw values AND the reported % changes.
     The build recomputes every % change and cash share from the raw values and FAILS if a
     reported figure disagrees by more than 0.05 pts (the source graphics sometimes drop signs).
  2. Copy data/narrative-YYYY-MM.json and re-read every sentence — the numbers are pulled from
     data automatically, the judgments ("seller-leaning", "more negotiating room") are not.
  3. Run the build, then look at every PNG in previews/.
"""
from __future__ import annotations

import argparse
import base64
import io
import json
import math
import subprocess
import sys
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

import qrcode
import qrcode.image.svg
from jinja2 import Environment, FileSystemLoader, StrictUndefined
from weasyprint import HTML

ROOT = Path(__file__).resolve().parent


# ── Formatting filters ──────────────────────────────────────────────────────
def f_int(v):   return f"{int(round(v)):,}"
def f_usd(v):   return f"${int(round(v)):,}"
def f_dec1(v):  return f"{v:.1f}"
def f_abspct(v): return f"{abs(v):.1f}%"
def f_signed(v):
    # U+2212 true minus so negative values align with positives in tabular figures
    return ("+" if v > 0 else "−" if v < 0 else "") + f"{abs(v):.1f}%"
def f_metric(m):
    return {"int": f_int, "usd": f_usd, "dec1": f_dec1, "pct": lambda v: f"{v:.1f}%"}[m["fmt"]](m["current"])
def f_metric_prior(m):
    return {"int": f_int, "usd": f_usd, "dec1": f_dec1, "pct": lambda v: f"{v:.1f}%"}[m["fmt"]](m["prior"])
def f_arrow(v): return "↑" if v > 0 else "↓" if v < 0 else "→"


# ── Data validation ─────────────────────────────────────────────────────────
def round1(v: float) -> float:
    """Round to 1dp half away from zero, the way the source graphics round.

    Python's round() is half-to-even, so round(11.25, 1) is 11.2 while the
    graphic prints 11.3 — and the check below would then reject a figure that
    was transcribed correctly. September 2026 hit this twice: Martin condo days
    to contract (89 vs 80 = exactly 11.25%) and St. Lucie single-family median
    price (395,000 vs 400,000 = exactly -1.25%). The tolerance stays at 0.05;
    only the rounding convention changes.
    """
    return float(Decimal(repr(v)).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))


def validate(data: dict) -> list[str]:
    problems = []
    for seg in data["segments"]:
        for key, m in seg["metrics"].items():
            calc = (m["current"] - m["prior"]) / m["prior"] * 100
            if abs(round1(calc) - m["pct"]) > 0.05 + 1e-9:
                problems.append(f"{seg['key']}.{key}: reported {m['pct']}% but raw values give {calc:.2f}%")
        m = seg["metrics"]
        share = m["paidInCash"]["current"] / m["closedSales"]["current"] * 100
        if abs(round1(share) - data["cashShare"][seg["key"]]) > 0.05 + 1e-9:
            problems.append(f"cashShare.{seg['key']}: stated {data['cashShare'][seg['key']]} but counts give {share:.2f}%")
    return problems


# ── Months-of-supply chart (inline SVG) ─────────────────────────────────────
def supply_chart(data: dict) -> str:
    """Horizontal bars: months of supply, current vs prior year, per segment, 0-10 scale.
    Presentation attributes are inline because WeasyPrint does not apply page CSS inside SVG."""
    TEAL, TEAL_D, GREY, MUTED, BODY, NAVY, GOLD = "#137580", "#0E5E66", "#B7C6D3", "#64748B", "#3B4B5C", "#0F2233", "#8A6E33"
    FF = 'font-family="Inter"'
    W, bar_h = 700, 18
    plot_x0, plot_x1 = 112, 650
    top = max(max(sg["metrics"]["monthsSupply"]["current"], sg["metrics"]["monthsSupply"]["prior"]) for sg in data["segments"])
    scale_max = float(max(10, 2 * math.ceil(top / 2)))   # never clip a bar (e.g. 10.1 months -> 0-12 scale)
    x = lambda v: plot_x0 + (plot_x1 - plot_x0) * min(v, scale_max) / scale_max
    parts, y = [], 26
    for seg in data["segments"]:
        ms = seg["metrics"]["monthsSupply"]
        parts.append(f'<text x="0" y="{y + 11}" {FF} font-size="11" font-weight="600" fill="{NAVY}">{seg["label"]}</text>')
        y += 18
        for yr, val, cur in ((data["dataMonth"], ms["current"], True), (data["priorMonth"], ms["prior"], False)):
            parts.append(f'<text x="{plot_x0 - 10}" y="{y + 13}" {FF} font-size="10" font-weight="500" fill="{BODY}" text-anchor="end">{yr}</text>')
            parts.append(f'<rect x="{plot_x0}" y="{y}" width="{x(val) - plot_x0:.1f}" height="{bar_h}" rx="3" fill="{TEAL if cur else GREY}"/>')
            # value label sits inside the bar end, so it never crosses the 6-month reference line
            parts.append(f'<text x="{x(val) - 8:.1f}" y="{y + 13}" {FF} font-size="10.5" font-weight="700" text-anchor="end" fill="{"#FFFFFF" if cur else NAVY}">{val:.1f} mo</text>')
            y += bar_h + 5
        y += 10
    H = y
    grid = []
    for t in range(0, int(scale_max) + 1, 2):
        gx = x(t)
        grid.append(f'<line x1="{gx:.1f}" y1="18" x2="{gx:.1f}" y2="{H - 8}" stroke="#E3E9EF" stroke-width="1"/>')
        grid.append(f'<text x="{gx:.1f}" y="11" {FF} font-size="9" font-weight="500" fill="{MUTED}" text-anchor="middle">{t}</text>')
    rx = x(6)
    grid.append(f'<line x1="{rx:.1f}" y1="18" x2="{rx:.1f}" y2="{H - 8}" stroke="{GOLD}" stroke-width="1.5" stroke-dasharray="4 3"/>')
    return (f'<svg class="supply-chart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" '
            f'aria-label="Months of supply, {data["dataMonth"]} vs {data["priorMonth"]}">'
            + "".join(grid) + "".join(parts) + "</svg>")


def qr_svg(url: str) -> str:
    img = qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage, box_size=10, border=0,
                      error_correction=qrcode.constants.ERROR_CORRECT_M)
    buf = io.BytesIO()
    img.save(buf)
    return "data:image/svg+xml;base64," + base64.b64encode(buf.getvalue()).decode()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="data/pbc-market-2026-08.json")
    ap.add_argument("--narrative", default="data/narrative-2026-08.json")
    ap.add_argument("--out", default=None, help="PDF path (default: outputs/<slug>.pdf)")
    ap.add_argument("--no-qr", action="store_true", help="omit the QR code")
    ap.add_argument("--no-previews", action="store_true")
    args = ap.parse_args()

    data = json.loads((ROOT / args.data).read_text())
    narrative = json.loads((ROOT / args.narrative).read_text())

    problems = validate(data)
    if problems:
        print("DATA CHECK FAILED:\n  " + "\n  ".join(problems), file=sys.stderr)
        return 1

    env = Environment(loader=FileSystemLoader(ROOT / "template"), undefined=StrictUndefined, autoescape=False)
    for name, fn in dict(int=f_int, usd=f_usd, dec1=f_dec1, abspct=f_abspct, signed=f_signed,
                         metric=f_metric, metric_prior=f_metric_prior, arrow=f_arrow).items():
        env.filters[name] = fn

    segs = {s["key"]: {**s, "m": s["metrics"]} for s in data["segments"]}
    ctx = {**data, "s": segs, "cash": {k: f"{v:.1f}" for k, v in data["cashShare"].items()}}

    def render_str(v):
        if isinstance(v, str):
            return env.from_string(v).render(**ctx)
        if isinstance(v, list):
            return [render_str(i) for i in v]
        if isinstance(v, dict):
            return {k: render_str(i) for k, i in v.items() if not k.startswith("_")}
        return v

    copy = render_str(narrative)
    link_url = f'{data["siteUrl"]}{data["ctaPath"]}?{data["utm"]["link"]}'
    qr_url = f'{data["siteUrl"]}{data["ctaPath"]}?{data["utm"]["qr"]}'

    html = env.get_template("report.html.j2").render(
        **ctx, copy=copy, supply_chart=supply_chart(data),
        link_url=link_url, qr_url=qr_url, qr_src=None if args.no_qr else qr_svg(qr_url),
    )
    (ROOT / "build").mkdir(exist_ok=True)
    (ROOT / "build" / "report.html").write_text(html)

    # Inside the doyouneedahome.com repo (scripts/pbc-county-report/) the established, never-public
    # download directory is private/reports/. Standalone, fall back to ./outputs/.
    repo_reports = ROOT.parent.parent / "private" / "reports"
    default_dir = repo_reports if repo_reports.is_dir() else ROOT / "outputs"
    out = Path(args.out) if args.out else default_dir / f'{data["slug"]}.pdf'
    out.parent.mkdir(parents=True, exist_ok=True)
    HTML(string=html, base_url=str(ROOT)).write_pdf(out, pdf_variant=None)
    print(f"PDF  -> {out}")

    if not args.no_previews:
        prev = ROOT / "previews"
        prev.mkdir(exist_ok=True)
        for p in prev.glob("page-*.png"):
            p.unlink()
        subprocess.run(["pdftoppm", "-r", "110", "-png", str(out), str(prev / "page")], check=True)
        print(f"PNGs -> {prev}/")

    from verify import verify
    return verify(out, expected_links=[link_url, f'tel:{data["phoneTel"]}'],
                  qr_expected=None if args.no_qr else qr_url)


if __name__ == "__main__":
    sys.exit(main())
