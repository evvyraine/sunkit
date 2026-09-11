#!/usr/bin/env bash
#
# Capture README screenshots from a running Storybook.
#
#   pnpm storybook            # in one terminal
#   pnpm screenshots          # in another
#
# Override the Chrome binary or targets with env vars:
#   CHROME="/path/to/chrome" STORYBOOK_URL=http://localhost:6006 pnpm screenshots
#
set -euo pipefail

STORYBOOK_URL="${STORYBOOK_URL:-http://localhost:6006}"
OUT_DIR="${OUT_DIR:-docs}"
SETTLE_MS="${SETTLE_MS:-8000}"

if [[ -z "${CHROME:-}" ]]; then
  for candidate in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Google Chrome Dev.app/Contents/MacOS/Google Chrome Dev" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
    "$(command -v google-chrome || true)" \
    "$(command -v chromium || true)"; do
    if [[ -n "$candidate" && -x "$candidate" ]]; then
      CHROME="$candidate"
      break
    fi
  done
fi

if [[ -z "${CHROME:-}" || ! -x "$CHROME" ]]; then
  echo "error: no Chrome/Chromium binary found. Set CHROME=/path/to/chrome." >&2
  exit 1
fi

# story id | output file name | window size
SHOTS=(
  "examples-component-gallery--light|gallery-light|1440,1360"
  "examples-component-gallery--dark|gallery-dark|1440,1360"
  "examples-project-setup--default|overview|1440,1000"
  "atoms-button--all-variants|button|1100,560"
  "atoms-input--variants|input|760,620"
  "atoms-select--default|select|620,420"
  "atoms-checkbox--all-tones|checkbox|620,640"
  "atoms-card--variants|card|900,620"
  "atoms-alert--all-variants|alert|900,700"
  "atoms-progress--all-tones|progress|900,720"
  "atoms-colorpicker--default|colorpicker|620,360"
  "atoms-datepicker--default|datepicker|620,480"
  "atoms-slider--with-marks|slider|760,420"
  "atoms-shape--all-shapes|shape|900,760"
  "atoms-tabs--default|tabs|760,420"
  "atoms-dialog--sizes|dialog|760,480"
  "atoms-textarea--variants|textarea|760,560"
  "atoms-toggle--all-tones|toggle|760,400"
  "atoms-radiogroup--default|radiogroup|760,480"
  "atoms-badge--all-tones|badge|760,360"
  "atoms-skeleton--lines|skeleton|620,360"
  "atoms-spinner--sizes|spinner|620,360"
)

mkdir -p "$OUT_DIR"

for entry in "${SHOTS[@]}"; do
  IFS='|' read -r id name size <<<"$entry"
  echo "→ $id -> $OUT_DIR/$name.png ($size)"
  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --force-device-scale-factor=2 \
    --window-size="$size" \
    --virtual-time-budget="$SETTLE_MS" \
    --screenshot="$OUT_DIR/$name.png" \
    "$STORYBOOK_URL/iframe.html?id=$id&viewMode=story" \
    >/dev/null 2>&1
done

echo "done: $OUT_DIR"
