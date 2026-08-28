# Mobile category filter findings

## 2026-08-25 visual QA

At 375px, `products.html` renders a compact full-width category trigger below the search field. The trigger uses the existing navy/cyan scientific-corporate palette, keeps the selected `View All Products` label readable, and no longer exposes the tall category list in the initial viewport. `catalog.html` renders the same compact trigger and hides the large category-card grid on mobile; the page keeps its footer rhythm without a large empty category block.

The interaction harness passed for both 375px and 390px. It confirmed the trigger opens, the option list is reachable, a selected option updates the visible label, the popover closes after selection, Escape/outside click closes it, and the selected label remains synchronized with the active category after RU, UZ, and EN changes.

The selected category popovers use a scrollable white glass surface with touch-sized options and reduced-motion fallbacks. Desktop behavior remains on the existing sidebar/card layouts because the new compact shells are limited to the mobile breakpoint.

## Clear action, badge, and transition refinement

At 390px, the Products and Catalog triggers remain compact and aligned within the viewport. The badge is correctly hidden when no category/search filter is active, leaving the trigger visually quiet in its default state. The new popover keeps a compact header row for the category label and clear action; its open/close behavior now uses opacity, visibility, transform, and pointer-event transitions rather than an abrupt display toggle. Reduced-motion rules disable the transition effects.

## Product Details mobile refinement

At 375px and 390px, the populated Product Details route keeps document width equal to the viewport. The title sits safely below the fixed navbar, the product image has a balanced card treatment, thumbnails remain compact, metadata wraps inside its card, feature cards use a clean two-column touch layout, and the floating contact control does not create horizontal overflow. Product content and existing actions remain in the established order for continued scrolling.

## Product sharing, similar products, and translation-key cleanup

The 390px full-page Product Details capture confirms that the social share panel sits within the price/action card, the copy-link and Telegram/WhatsApp/Facebook options remain compact, and the Similar products section renders below Specifications with a two-column mobile grid. The previously visible raw keys `description_tab`, `specs_tab`, `share_product`, and `similar_products` now render as localized labels after bumping the Product Details lang.js cache version.

## Header/Catalog/Contact reference notes

- Header wordmark: dark navy `FYZEN-LAB` with Uzbek slogan `CHEGARASIZ ILM-FAN` beneath it, aligned left and kept compact.
- Navigation: `KATALOG`, `MAHSULOTLAR`, `BRENDLAR`, `BIZ HAQIMIZDA`, `YANGILIKLAR`, `ALOQA`; uppercase, bold navy, evenly spaced on a clean white header.
- Mobile: rounded icon cards stacked vertically, with the blue floating chat trigger near the lower-right edge.
- Catalog: remove the separate category filter trigger and use compact icon-led rows for sections.
