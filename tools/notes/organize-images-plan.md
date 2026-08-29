# Image reorganization plan

This branch (fix/organize-images) contains tooling to help centralize static images in the project.

What I added:

- tools/scripts/organize-images.sh — interactive script that:
  - Scans git-tracked image files (png, jpg, jpeg, svg, webp).
  - Shows a preview of planned moves into `client/public/assets/images/`.
  - When run with `--apply`, attempts to `git mv` each file into the destination (falling back to copy if necessary).
  - Avoids filename collisions by appending a short hash when required.

Why this approach:

- Large automated moves can be risky; the script lets you preview changes first and then apply them.
- `git mv` preserves history for moved files.
- The destination follows the deployment guidance in DEPLOYMENT.md (client/public/assets/images) while keeping the repo safe.

How to use (review locally):

1. Checkout the branch:

   git fetch origin
   git checkout fix/organize-images

2. Run the script in preview mode (no changes):

   bash tools/scripts/organize-images.sh

   Confirm the planned moves.

3. If the preview looks good, run with --apply to perform the moves:

   bash tools/scripts/organize-images.sh --apply

4. Commit and push the changes:

   git add -A
   git commit -m "Organize images into client/public/assets/images"
   git push origin fix/organize-images

5. Open a Pull Request from fix/organize-images into your main branch and review the changes on GitHub.

Notes & next steps

- After applying the moves, search the repo for references to moved paths (img src, CSS url(), JS data attributes) and update them if necessary. The script does not modify references automatically to avoid risky replacements.
- I can help update references in HTML/JS/CSS once the move commit is created — would you like me to also create a follow-up commit that updates all `/assets/images/...` references to the new paths (where needed)?
- The code search results I previously ran may be incomplete; review the search UI for a full list:
  https://github.com/amuso3712-arch/fyzen-lab/search?q=%5C.(png%7Cjpg%7Cjpeg%7Csvg%7Cwebp)&type=code

