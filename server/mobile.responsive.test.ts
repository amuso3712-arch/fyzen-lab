import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const mobileCss = readFileSync(resolve(projectRoot, "client/assets/css/styles.css"), "utf8");
const adminHtml = readFileSync(resolve(projectRoot, "client/admin.html"), "utf8");
const aboutHtml = readFileSync(resolve(projectRoot, "client/about.html"), "utf8");
const contactHtml = readFileSync(resolve(projectRoot, "client/contact.html"), "utf8");
const languageSource = readFileSync(resolve(projectRoot, "client/assets/js/lang.js"), "utf8");
const mainSource = readFileSync(resolve(projectRoot, "client/assets/js/main.js"), "utf8");
const productsHtml = readFileSync(resolve(projectRoot, "client/products.html"), "utf8");
const catalogHtml = readFileSync(resolve(projectRoot, "client/catalog.html"), "utf8");
const productDetailsHtml = readFileSync(resolve(projectRoot, "client/product-details.html"), "utf8");
const publicHtml = [
  "about.html", "blog.html", "brands.html", "cart.html", "catalog.html",
  "checkout.html", "contact.html", "index.html", "product-details.html", "products.html", "wishlist.html",
].map(file => ({ file, source: readFileSync(resolve(projectRoot, "client", file), "utf8") }));


describe("mobile responsive guardrails", () => {
  it("keeps the refined drawer from intercepting the page while inactive", () => {
    expect(mobileCss).toContain(".mobile-nav {\n    pointer-events: none;");
    expect(mobileCss).toContain(".mobile-nav.active {\n    right: 0 !important;");
    expect(mobileCss).toContain("left: auto !important;");
  });

  it("uses one-column phone cards and protects the viewport from overflow", () => {
    expect(mobileCss).toContain("grid-template-columns: 1fr !important;");
    expect(mobileCss).toContain("overflow-x: hidden !important;");
    expect(mobileCss).toContain("position: relative !important;");
  });

  it("protects About and Contact page-specific mobile corrections", () => {
    expect(aboutHtml).toContain('<body class="about-page">');
    expect(contactHtml).toContain('<body class="contact-page">');
    expect(mobileCss).toContain(".about-page .company-block {\n        padding-top: 88px !important;");
    expect(mobileCss).toContain(".contact-page .page-header {\n        padding: 88px 16px 38px !important;");
    expect(mobileCss).toContain(".contact-page .info-value {");
    expect(mobileCss).toContain("overflow-wrap: anywhere;");
  });

  it("keeps the About copy concise and available in all three languages", () => {
    expect(languageSource).toContain('about_title_new: "FYZEN-LAB — <strong>High-tech</strong> laboratory solutions in Uzbekistan."');
    expect(languageSource).toContain('about_title_new: "FYZEN-LAB — O\'zbekistondagi <strong>yuqori texnologiyali</strong> laboratoriya yechimlari."');
    expect(languageSource).toContain('about_title_new: "FYZEN-LAB — <strong>Высокотехнологичные</strong> лабораторные решения в Узбекистане."');
    expect(languageSource).toContain("Reliable equipment for accurate diagnostic and research results.");
    expect(languageSource).toContain("Aniq diagnostika va tadqiqot natijalari uchun ishonchli uskunalar.");
    expect(languageSource).toContain("Надежное оборудование для точной диагностики и исследований.");
  });

  it("keeps mobile language buttons targetable and delegated", () => {
    expect(mainSource).toContain('type="button" data-lang="en" onclick="changeLanguage(\'en\')"');
    expect(languageSource).toContain("document.addEventListener('click', (event) => {");
    expect(languageSource).toContain("event.stopPropagation();");
    expect(languageSource).toContain("changeLanguage(lang);");
  });

  it("provides clear actions, active badges, and smooth mobile filter transitions", () => {
    expect(productsHtml).toContain('id="mobileFilterClear" data-i18n="clear_filters"');
    expect(productsHtml).toContain('id="mobileFilterBadge" hidden');
    expect(productsHtml).toContain("function updateMobileFilterBadge()");
    expect(productsHtml).toContain("function clearMobileFilters()");
    expect(productsHtml).toContain("badge.hidden = count === 0;");
    expect(productsHtml).toContain("transition: opacity 180ms ease, transform 220ms cubic-bezier(0.23, 1, 0.32, 1), visibility 0s linear 220ms;");
    expect(catalogHtml).not.toContain('id="catalogMobileFilterTrigger"');
    expect(catalogHtml).not.toContain('id="catalogMobileFilterOptions"');
    expect(catalogHtml).toContain("cat-card-p.is-expanded");
    expect(catalogHtml).toContain("the first tap reveals the short description");
  });

  it("provides compact Catalog and Contact mobile information patterns", () => {
    expect(mobileCss).toContain(".contact-page .contact-info .info-card.is-open");
    expect(contactHtml).toContain("other.setAttribute('aria-expanded', 'false')");
    expect(contactHtml).toContain("card.setAttribute('aria-expanded', 'true')");
    expect(mobileCss).toContain(".nav-brand-name {\n    font-family: 'Outfit'");
    expect(mobileCss).toContain(".contact-page .contact-info .info-card::after");
  });

  it("protects the Product Details mobile layout and touch-friendly controls", () => {
    expect(productDetailsHtml).toContain('href="assets/css/styles.css?v=29.0"');
    expect(productDetailsHtml).toContain(".p-details-wrapper {\n                min-height: 100vh;");
    expect(productDetailsHtml).toContain(".p-main-title {");
    expect(productDetailsHtml).toContain("overflow-wrap: anywhere;");
    expect(productDetailsHtml).toContain(".p-feature-card {");
    expect(productDetailsHtml).toContain("grid-template-columns: repeat(2, minmax(0, 1fr));");
    expect(productDetailsHtml).toContain("min-height: 52px;");
    expect(productDetailsHtml).toContain('id="productQty"');
    expect(productDetailsHtml).toContain("function initProductQuantity()");
    expect(productDetailsHtml).toContain("addToCart(p, getProductQuantity())");
    expect(productDetailsHtml).toContain('data-i18n-aria-label="increase_quantity"');
    expect(languageSource).toContain("document.querySelectorAll('[data-i18n-aria-label]')");
    expect(languageSource).toContain('"quantity": "Miqdor"');
    expect(languageSource).toContain('quantity: "Количество"');
    expect(productDetailsHtml).toContain(".info-modal-content");
    expect(productDetailsHtml).toContain("max-height: calc(100vh - 32px);");
    expect(productDetailsHtml).toContain('role="dialog" aria-modal="true" aria-hidden="true"');
    expect(productDetailsHtml).toContain("if (event.key !== 'Escape') return;");
    expect(productDetailsHtml).toContain("closeInfoModal(true)");
    expect(productDetailsHtml).toContain("closeZoom()");
    expect(productDetailsHtml).toContain('id="nativeShareBtn"');
    expect(productDetailsHtml).toContain('id="shareTelegram"');
    expect(productDetailsHtml).toContain('id="shareWhatsApp"');
    expect(productDetailsHtml).toContain('id="copyShareLink"');
    expect(productDetailsHtml).toContain('id="similarProductsSection"');
    expect(productDetailsHtml).toContain("function renderSimilarProducts(currentProduct)");
    expect(productDetailsHtml).toContain('data-i18n="description_tab"');
    expect(productDetailsHtml).toContain('data-i18n="specs_tab"');
    expect(languageSource).toContain('description_tab: "Описание"');
    expect(languageSource).toContain('"specs_tab": "Specifications"');
    expect(languageSource).toContain("refreshProductDetailLanguage");
    expect(productDetailsHtml).toContain('id="productWishlistBtn"');
    expect(productDetailsHtml).toContain("function initProductWishlist(product)");
    expect(productDetailsHtml).toContain("toggleWishlist(product.id, button)");
    expect(productDetailsHtml).toContain("showToast(t('link_copied'), 'success')");
    expect(productDetailsHtml).toContain("https://t.me/fyzen_lab");
    expect(productDetailsHtml).toContain("https://www.instagram.com/fyzen_lab?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==");
    expect(productDetailsHtml).toContain("tel:+998990342002");
    expect(productDetailsHtml).toContain("https://wa.me/998990342002");
    expect(productDetailsHtml).toContain("mailto:info@fyzen-lab.uz");
    expect(languageSource).toContain('wishlist_add: "Sevimlilarga qo\'shish"');
    expect(languageSource).toContain('wishlist_remove: "Убрать из избранного"');
  });

  it("uses the verified Telegram and Instagram destinations across public pages", () => {
    for (const { file, source } of publicHtml) {
      expect(source, file).toContain("https://t.me/fyzen_lab");
      expect(source, file).toContain("https://www.instagram.com/fyzen_lab?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==");
      expect(source, file).not.toContain("https://t.me/fyzenlab");
      expect(source, file).not.toContain("https://t.me/fyzen_bot");
      expect(source, file).not.toContain("https://instagram.com/fyzenlab");
      expect(source, file).not.toContain("https://www.instagram.com/fyzen.lab");
    }
  });

  it("provides a mobile admin sidebar toggle and scrim", () => {
    expect(adminHtml).toContain("class=\"admin-menu-toggle\"");
    expect(adminHtml).toContain("class=\"admin-sidebar-scrim\"");
    expect(adminHtml).toContain("function toggleAdminSidebar()");
    expect(adminHtml).toContain("function closeAdminSidebar()");
  });
});
