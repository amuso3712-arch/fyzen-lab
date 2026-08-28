# Brand logo QA notes

- Preview route checked: `/brands.html` at the current preview URL.
- Browser DOM lists all 29 directory entries, including `SCITEK` and `Pruftechnik`; no `SCITECH` entry remains in rendered brand cards.
- Confirmed uploaded storage paths rendered in the Brands page markdown and modal flow:
  - GTJ → `/manus-storage/gtj_81cc4aba.png`
  - YGYB → `/manus-storage/ygyb_681d5e6d.png`
  - SCITEK → `/manus-storage/scitek_665b073a.png`
  - HEAL FORCE → `/manus-storage/heal-force_f1a0570c.png`
  - Pruftechnik → `/manus-storage/pruftecnic_c71c26f0.png`
- GTJ card was opened successfully and the accessible brand-details modal displayed the GTJ logo, specialty, description, and Products CTA.
- The preview page shows a non-blocking preview-mode banner; it does not affect the brand directory interaction.

## Mobile report follow-up

The current live URL `https://fyzen-lab.uz/brands.html` still serves the older standalone 15-brand directory, with local `assets/images/brands/*` paths and old social destinations. The current preview URL serves the updated 29-brand directory and the five confirmed storage logos, including `SCITEK` and `Pruftechnik`. Therefore, if the user is checking `fyzen-lab.uz` on a phone, the new logos cannot appear until this checkpoint is published and the domain is bound to the new deployment.

## Mobile preview DOM diagnosis

A preview DOM probe confirmed that the updated page contains all 29 cards. The five confirmed images have `complete: true`, nonzero `naturalWidth`, `display: block`, and visible dimensions: GTJ 170×59.5, YGYB 170×70.1, SCITEK 100.9×72, HEAL FORCE 72.3×72, and Pruftechnik 72×72. The probe was run in the browser at a 1280px viewport, so the remaining user-facing issue is likely the mobile preview’s narrow-card visibility or lazy-image capture behavior rather than a missing storage asset.

## Mobile screenshot comparison

The Management UI 390px capture still visually showed star symbols in several cards, while an independent Playwright 390px capture of the same preview rendered the uploaded logos for GTJ, YGYB, HEAL FORCE, and Pruftechnik. The Playwright DOM confirmed the five images are complete and have nonzero natural widths. This indicates the remaining discrepancy is primarily in the screenshot/preview rendering pipeline and image visibility at the very small card size, not missing WebDev storage responses. The CSS was strengthened with eager loading, explicit dimensions, and a two-column 390px grid to make the logos visible in both paths.
