#!/usr/bin/env bash
# Renders scripts/og/og.html into the social share images with headless Chrome.
# Usage: npm run og
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/apps/web/public"
CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" google-chrome chromium chromium-browser; do
    if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then CHROME="$c"; break; fi
  done
fi
[ -n "$CHROME" ] || { echo "Chrome not found. Set CHROME=/path/to/chrome." >&2; exit 1; }

for lang in en pt; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1200,630 --virtual-time-budget=3000 \
    --screenshot="$OUT/og-$lang.png" "file://$ROOT/scripts/og/og.html#$lang" >/dev/null 2>&1
  echo "wrote apps/web/public/og-$lang.png"
done
