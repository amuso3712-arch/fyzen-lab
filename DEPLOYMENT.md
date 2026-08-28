# Fyzen Lab deployment handoff

## Project structure

The deployable application is the repository root. Public multi-page frontend files are under `client/`; shared browser assets are under `client/assets/`; server entry and API logic are under `server/`; database schema and migrations are under `drizzle/`; shared types/constants are under `shared/`. One-off QA, audit, and migration helpers are kept under `tools/qa/`, while investigation notes are kept under `tools/notes/`.

## Local verification

Use the following commands from the project root before publishing:

```bash
pnpm install
pnpm check
pnpm test
pnpm build
```

`pnpm check` runs TypeScript validation, `pnpm test` runs the Vitest regression suite, and `pnpm build` creates the production server bundle and static public output in `dist/`. Start local development with `pnpm dev`; do not hardcode a port in application code.

## Manus publishing

Create a checkpoint after the final verification, then use the project Management UI **Publish** button. Configure the custom domain from Management UI → Settings → Domains. After the domain is bound, set the Telegram Mini App URL to `/telegram-admin.html` and keep `/admin.html` as the protected web fallback.

## GitHub and Render deployment

Upload the repository root to GitHub, not the generated `dist/` folder and not only the files inside `client/`. This is a fullstack Node application, so use Render **Web Service**, not Static Site. The included `render.yaml` contains the build command (`corepack enable && pnpm install --frozen-lockfile && pnpm build`) and start command (`pnpm start`). The service must use Node 22 and must receive a Render-provided `PORT`; the server does not hardcode a port.

Set all `sync: false` values from `render.yaml` in Render’s Environment variables. Never copy values from `.project-config.json`, `.env`, or a Manus preview URL into GitHub. `TELEGRAM_ADMIN_PANEL_URL` and `TELEGRAM_MINI_APP_URL` must point to the deployed service’s `/telegram-admin.html` route, such as `https://your-service.onrender.com/telegram-admin.html`, until a custom domain is connected. `VITE_FRONTEND_FORGE_API_URL` is the Manus Forge API URL, not the Render website URL, and must be paired with `VITE_FRONTEND_FORGE_API_KEY`.

After deployment, verify `/`, `/catalog.html`, `/contact.html`, `/brands.html`, `/blog.html`, and `/telegram-admin.html`, then confirm that `/api/news/published` returns JSON. Do not delete the old `fyzen-lab.uz` hosting files until the new service and domain have been verified.

## Environment and security

Do not commit `.env` files or paste secrets into source files. Telegram, OAuth, database, storage, and built-in API values are injected through project Secrets. Keep the Telegram webhook secret and bot token server-side. The Render export intentionally bundles the required site images in `client/public/assets/images/` and references them as `/assets/images/...`, so external hosting does not depend on Manus-only `/manus-storage/...` proxy credentials. Keep these bundled assets when uploading the repository to GitHub.

## Data and admin notes

Products and news are empty after the testing-data cleanup. Add real catalog content through the authorized Telegram Mini App/admin workflow. The verified 29-brand directory and category metadata are frontend reference data and should not be deleted when clearing product records.
