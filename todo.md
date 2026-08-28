# Fyzen Lab hero revision

- [x] Inspect current homepage hero markup, CSS layers, and available storage image URLs.
- [x] Replace the 3D/network visual treatment with a single full-bleed laboratory background image.
- [x] Preserve readable hero copy, CTA buttons, and the experience badge over the image.
- [x] Verify desktop and mobile layouts, image focal point, contrast, and CTA behavior.
- [x] Build, save a checkpoint, and report the revised hero.

## Hero full-height extension

- [x] Inspect the current hero height, crop, and section boundary.
- [x] Extend the image treatment to the complete hero block bottom edge.
- [x] Verify desktop and mobile hero boundaries and save a checkpoint.

## Header wordmark refinement

- [x] Inspect current logo markup, font family, and tagline spacing.
- [x] Apply a refined wordmark type treatment and align both lines to one left edge.
- [x] Verify desktop/mobile header appearance, build, and save a checkpoint.

## About va Contact refinement

- [x] Audit About va Contact markup, content, assets, and interactions.
- [x] Define a shared premium page direction that matches the hero and header.
- [x] Refine About page structure, hierarchy, and responsive layout.
- [x] Refine Contact page form, contact cards, and responsive layout.
- [x] Verify both pages on desktop/mobile, build, and save a checkpoint.

## Telegram Contact + News va Brands

- [x] Inspect Telegram connector/config requirements and current form handler.
- [x] Enable secure backend capability and document required Telegram bot secrets from project Secrets.
- [x] Implement server-side Contact-to-Telegram message delivery and error states.
- [x] Redesign News page to match current Fyzen Lab visual system.
- [x] Redesign Brands page to match current Fyzen Lab visual system.
- [x] Verify form flow, responsive pages, build, and save a checkpoint.
- [x] Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are available without exposing their values.
- [x] Confirm the secrets are loaded in the server runtime without logging their values.
- [x] Start the Telegram bot from the destination account/chat, then repeat the approved live Contact delivery test after the current 403 response.

## Mobile navigation panel refinement

- [x] Audit mobile drawer markup, icons, spacing, and open/close behavior.
- [x] Implement a cleaner premium panel design with consistent menu states.
- [x] Verify mobile panel responsiveness, accessibility, and navigation behavior.
- [x] Build and save a checkpoint for the panel refinement.

## Mobile panel interaction verification follow-up

- [x] Verify drawer open/close, backdrop, submenu accordion, navigation links, and Escape behavior with a mobile interaction harness.
- [x] Save a new checkpoint after the interaction verification is complete.
- [x] Fix mobile drawer final active-state override and refresh stylesheet cache version after legacy CSS interception bug

## Mobile-first refinement pass

- [x] Audit all key pages at phone widths for overflow, clipped text, spacing, and touch targets.
- [x] Refine shared mobile header, navigation drawer, hero, cards, forms, and floating contact control.
- [x] Improve mobile-specific layouts for News, Brands, About, Contact, Catalog, Products, Cart, Checkout, Wishlist, and Product Details.
- [x] Verify phone screenshots and interactions at 375px and 390px widths.
- [x] Run unit/build checks and save a new checkpoint.
- [x] Verify a populated Product Details route at 375px and 390px widths.
- [x] Save a final checkpoint capturing the phone-specific refinements.

## Mobile menu visual order refinement

- [x] Compare the current mobile drawer structure and spacing with the supplied reference image.
- [x] Align menu items into a clean centered vertical stack with consistent width, icon size, and gaps.
- [x] Improve the Products accordion row and preserve clear expanded/collapsed interaction states.
- [x] Verify the reference-inspired drawer at 375px and 390px, then run tests/build and save a checkpoint.
- [x] Explicitly capture and verify the final v20 mobile drawer at 390px, including Products row width, arrow alignment, and submenu behavior.

## About va Contacts mobile correction

- [x] Audit About Us and Contacts pages separately at 375px and 390px for header, hero, content, cards, form, and footer issues.
- [x] Apply page-specific responsive layout fixes without changing the confirmed content or Telegram integration.
- [x] Verify About Us and Contacts screenshots and interactions, run tests/build, and save a new checkpoint.
- [x] Save a dedicated checkpoint after the About Us and Contacts v21 mobile corrections.

## About mobile title overflow correction

- [x] Diagnose the About title clipping and horizontal overflow at phone widths.
- [x] Make the long multilingual title wrap safely inside the mobile content column.
- [x] Recheck About at 375px and 390px and run tests/build.
- [x] Save a dedicated checkpoint after the About mobile title overflow correction.

## Multilingual mobile QA and About copy optimization

- [x] Audit RU, UZ, and EN language switching and text fit at 375px and 390px across the public mobile pages.
- [x] Shorten and optimize About Us mobile-facing copy in RU, UZ, and EN without changing the core meaning.
- [x] Verify language switching, About layout, wrapping, and overflow in all three languages, then run tests/build.
- [x] Interactively validate the shared RU/UZ/EN switcher on representative Home, About, and Contact mobile pages.
- [x] Save a dedicated checkpoint after interactive multilingual verification.

## Remaining mobile copy and language menu motion

- [x] Audit long multilingual text across Catalog, Products, Product Details, Cart, Checkout, Wishlist, Brands, News, and Contact pages.
- [x] Shorten remaining RU, UZ, and EN page copy for mobile while preserving key meaning and product information.
- [x] Add polished mobile language-menu open, active-state, and press animations with reduced-motion support.
- [x] Verify all languages and remaining pages at 375px/390px, run tests/build, and save a checkpoint.
- [x] Fix multilingual mobile harness query separators for routes with and without existing query strings.
- [x] Rerun corrected multilingual mobile verification across all routes and save the confirmed result in the final checkpoint.

## Mobile EN language switch bug

- [x] Investigate the reported mobile EN switch failure and trace the drawer button, language state, and translation update flow; the issue was not reproducible in the current preview.
- [x] Fix the mobile EN click/event or cache issue without breaking RU and UZ switching.
- [x] Verify RU → UZ → EN switching on mobile pages and run tests/build.
- [x] Add a targeted regression note/test documenting the non-reproducible failure and delegated-handler hardening rationale.
- [x] Save a dedicated checkpoint after the mobile EN switch hardening and corrected regression verification.

## Mobile category filter compaction

- [x] Audit the current Catalog/Products category filter markup, selection state, and mobile event flow.
- [x] Replace the oversized mobile category block with a compact accessible filter icon trigger and popover/list.
- [x] Keep the selected category visible, close the list after selection, and preserve all-category behavior.
- [x] Verify mobile category interactions and layout, run tests/build, and save a checkpoint.

## Mobile category filter compaction

- [x] Audit the current Catalog/Products category filter markup, selection state, and mobile event flow.
- [x] Replace the oversized mobile category block with a compact accessible filter icon trigger and popover/list.
- [x] Keep the selected category visible, close the list after selection, and preserve all-category behavior.
- [x] Verify mobile category interactions and layout, run tests/build, and save a checkpoint.

- [x] Save a new checkpoint covering the verified mobile category filter compaction.

## Mobile filter clear action and badge refinement

- [x] Add a multilingual “Clear filters” action inside Products and Catalog mobile filter popovers.
- [x] Show a compact active-filter count badge and keep it synchronized with selection state.
- [x] Refine popover open/close transitions with smooth, reduced-motion-safe animation.
- [x] Verify the refined mobile filter at 375px and 390px, run tests/build, and save a checkpoint.

- [x] Save a new checkpoint covering the clear action, active-filter badge, and smoother popover transition refinement.

## Product Details mobile refinement

- [x] Audit Product Details markup, product data rendering, controls, modals, and mobile layout constraints.
- [x] Refine the mobile product media, title, price, quantity, action buttons, and details sections without changing desktop behavior.
- [x] Improve mobile wrapping, touch targets, multilingual labels, and modal/action state handling.
- [x] Verify Product Details at 375px and 390px, update regression tests, run Vitest/build, and save a checkpoint.

## Product sharing, similar products, and translation-key cleanup

- [x] Audit Product Details translation keys, product data fields, and available social-share behavior.
- [x] Replace visible translation-key fallbacks with correct RU, UZ, and EN labels.
- [x] Add a responsive “Ulashish” control with Telegram, WhatsApp, native share, and copy-link options.
- [x] Add a relevant multilingual “O‘xshash mahsulotlar” section below Product Details.
- [x] Verify sharing/recommendations/translations at 375px and 390px, run tests/build, and save a checkpoint.

## Product Details wishlist, toast, and contact links

- [x] Audit wishlist state, toast notification behavior, floating social/contact links, and available Fyzen Lab contact data.
- [x] Add a persistent multilingual wishlist heart control to Product Details and synchronize its active state.
- [x] Ensure successful copy-link action shows a short bottom toast notification with translated text.
- [x] Replace placeholder social/contact destinations with the project’s verified Telegram, WhatsApp, Instagram, phone, and email data where available.
- [x] Verify wishlist, copy toast, social links, translations, mobile layout, tests/build, and save a checkpoint.

- [x] Align Product Details Instagram links with the verified `https://www.instagram.com/fyzen.lab` destination and add a contact-link regression check.

- [x] Save a new checkpoint covering the Product Details wishlist heart, copy-link toast, and verified contact-link updates.

## Verified social destinations update

- [x] Replace Product Details Telegram with `https://t.me/fyzen_lab` and Instagram with the user-provided `https://www.instagram.com/fyzen_lab?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==` URL.
- [x] Verify floating menu/footer URLs and save an updated checkpoint.

## Site-wide verified social destinations

- [x] Update all floating contact menus and visible footer social links to the user-provided Telegram and Instagram URLs.
- [x] Verify no legacy Telegram/Instagram destinations remain in public pages, run regression checks, and save a checkpoint.

## Site-wide floating chat and mobile top layout

- [x] Audit public-page floating chat/contact markup and mobile header/hero clipping at 375px and 390px.
- [x] Standardize the blue chat trigger so it appears consistently on every public page.
- [x] Fix shared mobile header, hero/page-header spacing, z-index, and overflow behavior without breaking desktop layouts.
- [x] Verify all public pages, run regression tests/build, and save a checkpoint.

## Header, Catalog, and Contact compact redesign

- [x] Audit the supplied reference styling against current header, Catalog, and Contact markup and mobile CSS.
- [x] Refine global header typography, slogan, navigation labels, spacing, and mobile presentation.
- [x] Remove the Catalog category trigger and add an expandable vertical icon list for catalog sections.
- [x] Convert Contact actions into a compact top-to-bottom icon list with expandable information panels.
- [x] Verify RU/UZ/EN at 375px, 390px, and desktop widths, run tests/build, and save a checkpoint.

- [x] Restore a usable mobile Catalog action inside expanded rows and verify both expand-info and PDF/catalog navigation at 375px and 390px.

- [x] Verify the header/Catalog/Contact redesign in RU, UZ, and EN at 375px and 390px, including translated labels and interactions.
- [x] Add desktop-width regression/visual verification for the refined header, Catalog section list, and Contact layout.

- [x] Save the final checkpoint for the Header, Catalog, and Contact compact redesign.

- [x] Add explicit RU/UZ/EN assertions for header labels, Catalog titles/descriptions, and Contact accordion labels/values at 375px and 390px.
- [x] Rerun exact multilingual regression.

- [x] Expand multilingual regression to assert all Catalog row titles/descriptions and all Contact accordion labels/values at 375px and 390px.
- [x] Rerun the strengthened regression; final checkpoint follows after this review.

## Mobile drawer Products row sizing correction

- [x] Make the Products accordion trigger match Catalog, Brands, About Us, News, and Contact in width, height, horizontal alignment, and spacing while preserving the submenu arrow and accordion behavior.
- [x] Verify the drawer at 375px and 390px, run regression checks, and save a checkpoint.

## Full mobile one-by-one QA audit

- [x] Audit Home, Products, Catalog, Product Details, Brands, About, News, Contact, Cart, Checkout, and Wishlist at 375px and 390px in RU, UZ, and EN.
- [x] Check each page for overflow, clipping, spacing, touch targets, drawer/filter/accordion behavior, forms, links, modal states, and untranslated keys.
- [x] Fix every confirmed mobile issue and add targeted regression assertions for each fix.
- [x] Re-run the complete mobile audit, Vitest, and production build; final checkpoint follows after this review.

## Telegram checkout verification and mobile feedback

- [x] Audit Contact-to-Telegram and Checkout client/server flow, validation, fallback, and error states.
- [x] Run safe invalid, mocked-success, mocked-failure, and authorized end-to-end contact/checkout tests without exposing secrets.
- [x] Fix confirmed Telegram or checkout issues and add targeted regression tests.
- [x] Add consistent mobile loading indicators, button press feedback, disabled/loading states, and reduced-motion support.
- [x] Re-run integration, mobile, Vitest, and production build checks; final checkpoint follows after this review.

## Admin orders, checkout confirmation, and brand filter

- [x] Audit admin authentication/entry flow, existing admin.html, order_requests schema/API, checkout success modal, and Products category/filter state.
- [x] Define protected admin-only order list and status-update behavior with explicit allowed statuses and safe error states.
- [x] Implement admin order management UI and explain authorized admin login/entry path without exposing credentials; server orders are editable and legacy inquiries are read-only.
- [x] Add animated multilingual checkout confirmation modal containing request, customer, and product details.
- [x] Add responsive multilingual brand filter to Products and synchronize it with search/category state.
- [x] Add targeted Vitest and browser regression coverage for admin access, order status updates, checkout modal, and brand filtering; authorized owner list/status QA passed.
- [x] Run security, mobile, integration, Vitest, and production checks; final checkpoint is being saved after this review.

## Telegram bot orders and product intake

- [x] Verify Telegram Bot API webhook support and choose a secure event-delivery approach for @fyzen_bot.
- [x] Define guided bot flows for creating orders and submitting products, including admin-only product approval.
- [x] Implement bot update handling, validation, deduplication, and secure Telegram user/admin authorization.
- [x] Persist bot-created orders and products; orders remain visible in admin.html fallback and approved products surface in the Products page.
- [x] Add safe image handling for product photos and Uzbek admin bot replies.
- [x] Add targeted unit/browser tests and verify webhook setup, mobile UI, and production build.
- [x] Save a stable checkpoint and document exact @fyzen_bot usage commands and steps.

## Telegram-only admin control

- [x] Replace the primary web-admin workflow with secure Telegram-only admin commands and inline buttons in @fyzen_bot.
- [x] Let authorized admins view orders and update order statuses from Telegram.
- [x] Let authorized admins add, edit, approve, and publish products from Telegram.
- [x] Preserve webhook security, deduplication, validation, and audit-safe database writes.
- [x] Verify Telegram-only admin flows, storefront compatibility, tests, and production build; save a checkpoint.

## Telegram admin identity and web fallback

- [x] Restrict bot-admin actions to Telegram numeric ID 8548524660 via server configuration, without hardcoding it in frontend code.
- [x] Keep admin.html intact as a secondary web-admin fallback while Telegram becomes the primary admin workflow.


## Telegram webhook secret and bot activation

- [x] Apply the user-provided valid `TELEGRAM_WEBHOOK_SECRET` and activate the @fyzen_bot webhook on the current public endpoint.
- [x] Verify the secret-protected webhook response and admin-only bot entry for Telegram ID `8548524660`.
- [x] Verify order status controls, product draft submission, photo upload limit, approval handler, and public approved-product sync with automated webhook/API guardrails.
- [x] Run the full regression suite and save a stable checkpoint after bot activation.


## Telegram bot hardening follow-up

- [x] Add explicit Telegram photo type/size validation and admin-facing recovery messages for failed photo download or storage upload.
- [x] Add end-to-end webhook handler tests for unauthorized users, order creation, product draft creation, photo limits, approval, and published-product sync guardrails.


## Telegram admin completion hardening

- [x] Add user-facing @fyzen_bot usage documentation covering commands, buttons, order flow, product flow, editing, approval, and publishing.
- [x] Clearly position Telegram as the primary admin workflow and admin.html as a secondary fallback in the web admin UX.
- [x] Add an audit trail for Telegram-admin order/product mutations with actor ID, action, target, before/after values, and timestamp.
- [x] Add stronger mock end-to-end verification for webhook-driven order/product flows, photo limits, approval, and approved-product storefront publication.


## Telegram bot response failure follow-up

- [ ] Diagnose why @fyzen_bot is not responding to admin messages by checking webhook delivery, route status, and runtime logs.
- [ ] Fix the response failure without weakening secret validation or Telegram ID authorization.
- [ ] Re-run focused webhook tests and full regression checks, then save a checkpoint.


## Telegram admin identity verification follow-up

- [ ] Confirm whether 8548524660 is the human admin Telegram ID or only the bot ID.
- [ ] If needed, update the server-side admin allowlist with the verified human Telegram ID and keep the bot ID unchanged.
- [ ] Re-test webhook response behavior after the identity check.
