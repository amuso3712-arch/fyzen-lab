#!/usr/bin/env bash
set -euo pipefail

# organize-images.sh
# Preview and optionally apply an image reorganization to centralize static images under
# client/public/assets/images/ while preserving git history via git mv when --apply is used.

DEST_DIR="client/public/assets/images"
PREVIEW_ONLY=1

if [[ "${1:-}" == "--apply" ]]; then
  PREVIEW_ONLY=0
fi

mkdir -p "$DEST_DIR"

echo "Scanning repository for image files..."

# Find image files tracked by git (png/jpg/jpeg/svg/webp) excluding node_modules and .git
mapfile -t IMAGES < <(git ls-files | rg --ignore-case "\.(png|jpe?g|svg|webp)$" -n || true)

if [[ ${#IMAGES[@]} -eq 0 ]]; then
  echo "No image files found by git ls-files. Exiting."
  exit 0
fi

echo "Found ${#IMAGES[@]} image(s). Listing sample (up to 50):"
for i in "${IMAGES[@]:0:50}"; do
  echo " - $i"
done

read -r -p "Proceed to prepare moves into $DEST_DIR? (y/N): " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "Cancelled by user. Exiting without changes."
  exit 0
fi

# Compute target paths, avoiding name collisions by preserving basename and appending a short hash if needed
for src in "${IMAGES[@]}"; do
  base="$(basename "$src")"
  target="$DEST_DIR/$base"
  if [[ -e "$target" ]]; then
    # append short hash of the source path to avoid overwrite
    h=$(echo -n "$src" | sha1sum | cut -c1-8)
    target="$DEST_DIR/${base%.*}_$h.${base##*.}"
  fi
  echo "Plan: $src -> $target"
  if [[ $PREVIEW_ONLY -eq 0 ]]; then
    # Ensure target directory exists (already created)
    # Use git mv if possible to preserve history; if target exists in index, fall back to copy
    mkdir -p "$(dirname "$target")"
    if git ls-files --error-unmatch "$src" > /dev/null 2>&1; then
      git mv "$src" "$target" || cp -a "$src" "$target"
      echo "Moved: $src -> $target"
    else
      cp -a "$src" "$target"
      echo "Copied (untracked): $src -> $target"
    fi
  fi
done

if [[ $PREVIEW_ONLY -eq 0 ]]; then
  echo "All files moved/copied. You should now run:"
  echo "  git add -A && git commit -m 'Organize images into client/public/assets/images' && git push origin fix/organize-images"
fi

echo "Done."
