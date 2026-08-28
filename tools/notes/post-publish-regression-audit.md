# Post-publish regression audit — 2026-08-28

## Live finding

The published Products page at `https://fyzenlab-44xviz3p.manus.space/products.html` referenced `assets/js/lang.js?v=26.0`, `assets/js/main.js?v=16.0`, and `assets/js/verified-brands.js?v=1.0`, but the runtime scripts were not executing. Directly opening `https://fyzenlab-44xviz3p.manus.space/assets/js/lang.js?v=26.0` returned the Home HTML document rather than JavaScript. The live page therefore had `typeof window.changeLanguage === "undefined"`, no `#dynLangSwitcher`, and no `FYZEN_BRAND_META` / `FYZEN_VERIFIED_BRANDS` globals.

This explains the reported language switcher failure, stale visible translations/title behavior, and missing brand rendering. The static page links were present, but the published asset paths resolved through the HTML fallback because `client/assets` was not included in the Vite production output.

## Local build finding

Before the fix, `pnpm build` produced `dist/public/*.html` and bundled CSS but did not produce `dist/public/assets/js/lang.js`, `main.js`, `verified-brands.js`, or `brand-logos.js`. Catalog and Contact HTML entries existed in the local output, but their referenced legacy runtime assets were absent.

## Applied fix

Added a build-only `vitePluginLegacyAssets` to `vite.config.ts` that recursively copies `client/assets` to the Vite output directory `dist/public/assets`. Bumped legacy script/page cache versions to `lang.js?v=27.0`, `main.js?v=17.0`, `verified-brands.js?v=3.0`, and page links `?v=12`.

Added `server/production.assets.test.ts` covering public page entries, runtime assets, language controls, localized title updater, 29-brand metadata, and the Vite copy contract.

## Verification

`pnpm check` passed. Targeted Vitest passed: 8 tests across 2 files. Production build passed and confirmed these output files exist:

- `dist/public/assets/js/lang.js`
- `dist/public/assets/js/main.js`
- `dist/public/assets/js/verified-brands.js`
- `dist/public/assets/js/brand-logos.js`
- `dist/public/catalog.html`
- `dist/public/contact.html`
- `dist/public/brands.html`

The active preview Home page loaded the language buttons, localized English title, working public links, and the updated asset versions.

## Preview verification update

The active preview loaded the new runtime successfully. Home showed UZ/RU/EN controls; clicking EN changed visible copy and produced the localized `Language changed to English` toast while the title was already `FYZEN-LAB - Medical Equipment`. Catalog loaded at `/catalog.html?v=12` with title `FYZEN-LAB - Catalog`, translated navigation, category cards, and the same language controls. This confirms the source/build fix addresses the published regression once the corrected checkpoint is republished.

Contact preview loaded with title `FYZEN-LAB - Contact`, UZ/RU/EN controls, address/phone/email/Telegram/Instagram links, and form fields. Brands preview loaded with title `FYZEN-LAB - Medical Equipment Brands`, visible language controls, all 29 requested brands, logo URLs, and 29 verified-brand metadata cards. The preview screenshot showed the current Manus visual-editor overlay; it is not part of the public site.
