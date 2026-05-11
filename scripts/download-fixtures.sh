#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# download-fixtures.sh
# Downloads real JSON fixtures from antonmedv/json-examples for testing.
#
# Usage:
#   ./scripts/download-fixtures.sh          # downloads 10MB, 25MB, 50MB, 100MB
#   ./scripts/download-fixtures.sh --all    # also downloads 250MB, 500MB, 1GB
#   ./scripts/download-fixtures.sh --clean  # removes all fixtures
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

FIXTURES_DIR="$(dirname "$0")/../src/__tests__/fixtures"
BASE_URL="https://raw.githubusercontent.com/antonmedv/json-examples/master"

# Files available in the repo
SMALL_FILES=("data_10mb.json" "data_25mb.json" "data_50mb.json" "data_100mb.json")
LARGE_FILES=("data_250mb.json" "data_500mb.json" "data_1gb.json")

mkdir -p "$FIXTURES_DIR"

if [[ "${1:-}" == "--clean" ]]; then
  echo "🗑  Cleaning fixtures..."
  rm -f "$FIXTURES_DIR"/data_*.json
  echo "✅ Done."
  exit 0
fi

FILES_TO_DOWNLOAD=("${SMALL_FILES[@]}")
if [[ "${1:-}" == "--all" ]]; then
  FILES_TO_DOWNLOAD+=("${LARGE_FILES[@]}")
  echo "⚠️  Downloading ALL files including 250MB, 500MB, 1GB. This may take a while."
fi

echo "📥 Downloading fixtures to $FIXTURES_DIR"
echo ""

for file in "${FILES_TO_DOWNLOAD[@]}"; do
  dest="$FIXTURES_DIR/$file"
  if [[ -f "$dest" ]]; then
    size=$(du -sh "$dest" | cut -f1)
    echo "✓ $file already exists ($size) — skipping"
  else
    echo "⬇  Downloading $file..."
    url="$BASE_URL/$file"
    if command -v curl &>/dev/null; then
      curl -L --progress-bar -o "$dest" "$url"
    elif command -v wget &>/dev/null; then
      wget -q --show-progress -O "$dest" "$url"
    else
      echo "❌ Neither curl nor wget found. Install one and retry."
      exit 1
    fi
    size=$(du -sh "$dest" | cut -f1)
    echo "✅ $file downloaded ($size)"
  fi
done

echo ""
echo "📁 Fixture directory contents:"
ls -lh "$FIXTURES_DIR"/*.json 2>/dev/null || echo "  (empty)"
