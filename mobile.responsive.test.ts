import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const mobileCss = readFileSync(resolve(projectRoot, "client/assets/css/styles.css"), "utf8");
const adminHtml = readFileSync(resolve(projectRoot, "client/admin.html"), "utf8");
const aboutHtml = readFileSync(resolve(projectRoot, "client/about.html"), "utf8");
const contactHtml = readFileSync(resolve(projectRoot, "client/contact.html"), "utf8");
const miniAppHtml = readFileSync(resolve(projectRoot, "client/telegram-admin.html"), "utf8");
const languageSource = readFileSync(resolve(projectRoot, "client/assets/js/lang.js"), "utf8");
const mainSource = readFileSync(resolve(projectRoot, "client/assets/js/main.js"), "utf8");
const productsHtml = readFileSync(resolve(projectRoot, "client/products.html"), "utf8");
const catalogHtml = readFileSync(resolve(projectRoot, "client/catalog.html"), "utf8");
const brandsHtml = readFileSync(resolve(projectRoot, "client/brands.html"), "utf8");
const verifiedBrandsSource = readFileSync(resolve(projectRoot, "client/assets/js/verified-brands.js"), "utf8");
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

  it("explains the truthful 2024 company history in a responsive About card", () => {
    expect(aboutHtml).toContain('class="about-history-card"');
    expect(aboutHtml).toContain('data-i18n="about_history_title"');
    expect(aboutHtml).toContain('data-i18n="about_history_text"');
    expect(aboutHtml).toContain('data-i18n="about_history_label"');
    expect(languageSource).toContain('about_history_title: "A clear start. A long-term mission."');
    expect(languageSource).toContain('about_history_title: "Aniq maqsad bilan boshlangan yo\'l."');
    expect(languageSource).toContain('about_history_title: "Начало с ясной целью."');
    expect(languageSource).toContain('about_history_label: "Founded in 2024"');
    expect(languageSource).toContain('about_history_label: "2024-yilda tashkil topgan"');
    expect(languageSource).toContain('about_history_label: "Основан в 2024 году"');
    expect(mobileCss).toContain(".about-history-card");
    expect(mobileCss).toContain("grid-template-columns: 1fr;");
  });

  it("applies the Catalog-style banner across internal public pages", () => {
    const bannerPages = publicHtml.filter(({ file }) => file !== "index.html");
    for (const { file, source } of bannerPages) {
      expect(source, file).toContain('class="fyz-page-banner');
      expect(source, file).toContain('class="fyz-page-banner-inner"');
    }
    const homeSource = publicHtml.find(({ file }) => file === "index.html")?.source ?? "";
    expect(homeSource).not.toContain('class="fyz-page-banner');
    expect(mobileCss).toContain(".fyz-page-banner");
    expect(languageSource).toContain('about_solutions: "Our Solutions"');
  });

  it("replaces the client carousel with truthful multilingual catalog solutions", () => {
    expect(aboutHtml).toContain('class="solutions-section"');
    expect(aboutHtml).toContain('data-i18n="about_solutions"');
    expect(aboutHtml).toContain('data-i18n="about_solutions_intro"');
    expect(aboutHtml).toContain('href="products.html?cat=analytical"');
    expect(aboutHtml).toContain('href="products.html?cat=medical"');
    expect(aboutHtml).toContain('href="products.html?cat=environmental"');
    expect(aboutHtml).not.toContain('id="clientsTrack"');
    expect(languageSource).toContain('about_solutions: "Our Solutions"');
    expect(languageSource).toContain('about_solutions: "Bizning yechimlarimiz"');
    expect(languageSource).toContain('about_solutions: "Наши решения"');
    expect(mobileCss).toContain(".about-page .solution-card:hover::before");
    expect(mobileCss).toContain('grid-template-areas: "index icon" "title title" "copy copy" "link link"');
    expect(mobileCss).toContain(".about-page .solution-link { grid-area: link;");
    expect(mobileCss).toContain("prefers-reduced-motion: reduce");
    const homeSource = publicHtml.find(page => page.file === "index.html")?.source ?? "";
    expect(homeSource).toContain("grid-template-columns: 112px minmax(0, 1fr)");
    expect(homeSource).toContain("overflow-wrap: anywhere");
  });

  it("keeps testing products and news removed while preserving admin insertion hooks", () => {
    expect(mainSource).toContain("const DEFAULT_PRODUCTS = [];");
    expect(mainSource).toContain("fyzen_published_products");
    const blogSource = publicHtml.find(page => page.file === "blog.html")?.source ?? "";
    expect(blogSource).toContain("const customNews = [...publishedNews");
    expect(blogSource).toContain("/api/news/published");
    expect(blogSource).not.toContain("Laboratoriya uskunasini tanlash bo‘yicha qo‘llanma");
  });

  it("adds Contact validation, smooth-scroll, and success confirmation flows", () => {
    expect(contactHtml).toContain('novalidate onsubmit="handleFormSubmit(event)"');
    expect(contactHtml).toContain('id="contactNameError"');
    expect(contactHtml).toContain('id="contactEmailError"');
    expect(contactHtml).toContain('id="contactMsgError"');
    expect(contactHtml).toContain("contact_error_email");
    expect(contactHtml).toContain("scrollIntoView({ behavior: 'smooth'");
    expect(contactHtml).toContain('id="contactSuccessModal"');
    expect(contactHtml).toContain("showContactSuccess()");
    for (const key of ["contact_error_name", "contact_error_email", "contact_error_message", "contact_success_title", "contact_success_description", "contact_success_close"]) {
      expect(languageSource, key).toContain(`${key}:`);
    }
  });

  it("refines the Telegram Mini App visual hierarchy without changing its API hooks", () => {
    expect(miniAppHtml).toContain("fyzen-cube-final_9ae90e1b.png");
    expect(miniAppHtml).toContain(".top { position: relative;");
    expect(miniAppHtml).toContain(".tabs { position: sticky;");
    expect(miniAppHtml).toContain("prefers-reduced-motion: reduce");
    expect(miniAppHtml).toContain("/api/telegram/miniapp/orders");
    expect(miniAppHtml).toContain("/api/telegram/miniapp/products");
  });

  it("supports header search clear, popular suggestions, and loading feedback", () => {
    const homeSource = publicHtml.find(page => page.file === "index.html")?.source ?? "";
    expect(homeSource).toContain('class="desktop-product-search"');
    expect(homeSource).toContain('data-search-clear');
    expect(homeSource).toContain('data-search-suggestions');
    expect(homeSource).toContain('data-search-suggestion="Shimadzu"');
    expect(mainSource).toContain("function initDesktopProductSearch()");
    expect(mainSource).toContain("form.classList.add('is-search-loading')");
    expect(mainSource).toContain("input.value = ''");
    expect(mobileCss).toContain(".search-submit-spinner");
    expect(mobileCss).toContain(".desktop-search-suggestions");
  });

  it("routes the Home consultation CTA to the Contact form", () => {
    const homeSource = publicHtml.find(page => page.file === "index.html")?.source ?? "";
    expect(homeSource).toContain('href="contact.html#contactForm"');
    expect(homeSource).not.toContain('href="call.html"');
    expect(publicHtml.find(page => page.file === "contact.html")?.source ?? "").toContain('id="contactForm"');
  });

  it("renders a polished multilingual Products empty state with an illustration", () => {
    const productsSource = publicHtml.find(page => page.file === "products.html")?.source ?? "";
    expect(productsSource).toContain("products-empty-state");
    expect(productsSource).toContain("fyzen-products-empty-state_bb8d471c.png");
    expect(productsSource).toContain("empty_products_title");
    expect(productsSource).toContain("empty_products_description");
    expect(productsSource).toContain("empty_products_cta");
    expect(mobileCss).toContain(".products-empty-state");
    expect(mobileCss).toContain(".products-empty-copy h2 { font-size: clamp(1.25rem, 6.8vw, 1.55rem);");
    expect(mobileCss).toContain("overflow-wrap: anywhere;");
    for (const key of ["empty_products_title", "empty_products_description", "empty_products_cta", "empty_products_image_alt"]) {
      expect(languageSource, key).toContain(`${key}:`);
    }
  });

  it("covers visible localization keys in all language dictionaries", () => {
    for (const key of ["about_solutions_eyebrow", "about_solutions", "about_solutions_intro", "admin_management", "admin_manage_roles", "footer_about", "pdf_loading", "no_specs", "zoom_hint", "fab_phone", "fab_telegram", "fab_instagram", "fab_whatsapp", "fab_email"]) {
      expect(languageSource, key).toContain(`${key}:`);
    }
    expect(aboutHtml).not.toContain(">about_solutions<");
    expect(aboutHtml).not.toContain(">about_solutions_intro<");
  });

  it("keeps the desktop Products dropdown but makes mobile Products a single link", () => {
    for (const { file, source } of publicHtml) {
      expect(source, file).toContain('class="nav-arrow"');
    }
    expect(mainSource).not.toContain("mobile-nav-arrow");
    expect(mainSource).toContain("dropdownMenu && i18nKey !== 'nav_products'");
    expect(mainSource).toContain("Products stays a compact single mobile link");
  });

  it("adds a compact mobile product search without restoring the Products submenu", () => {
    expect(mainSource).toContain('id="mobileProductSearch"');
    expect(mainSource).toContain('id="mobileProductSearchInput"');
    expect(mainSource).toContain('role="search"');
    expect(mainSource).toContain("submitMobileProductSearch(event)");
    expect(mainSource).toContain("products.html?search=${encodeURIComponent(query)}");
    expect(productsHtml).toContain("const searchParam = urlParams.get('search');");
    expect(productsHtml).toContain("searchInput').value = searchParam");
    expect(mainSource).not.toContain("mobile-nav-arrow");
  });

  it("removes mobile drawer top decoration without changing desktop navigation", () => {
    expect(mobileCss).toContain(".mobile-nav::before");
    expect(mobileCss).toContain(".mobile-nav::after");
    expect(mobileCss).toContain("content: none !important;");
    expect(mobileCss).toContain(".mobile-nav .mobile-nav-header");
    expect(mobileCss).toContain("border-bottom: 0 !important;");
    expect(publicHtml.find(page => page.file === "index.html")?.source).toContain("styles.css?v=45.0");
  });

  it("removes the duplicated mobile wordmark while keeping close and search controls", () => {
    expect(mainSource).not.toContain('class="mobile-nav-brand"');
    expect(mainSource).toContain('class="mobile-nav-header mobile-nav-header--compact"');
    expect(mainSource).toContain('class="mobile-nav-close"');
    expect(mainSource).toContain('id="mobileProductSearch"');
    expect(mobileCss).toContain(".mobile-nav-header--compact");
    expect(mobileCss).toContain("justify-content: flex-end !important;");
    expect(publicHtml.find(page => page.file === "index.html")?.source).toContain("styles.css?v=45.0");
  });

  it("keeps mobile language buttons targetable and delegated", () => {
    expect(mainSource).toContain('type="button" data-lang="en" onclick="changeLanguage(\'en\')"');
    expect(languageSource).toContain("document.addEventListener('click', (event) => {");
    expect(languageSource).toContain("event.stopPropagation();");
    expect(languageSource).toContain("changeLanguage(lang);");
  });

  it("provides clear actions, active badges, and smooth mobile filter transitions", () => {
    expect(productsHtml).toContain('<title data-i18n-title="products_page_title">FYZEN-LAB - Mahsulotlar</title>');
    expect(productsHtml).toContain('id="mobileFilterClear" data-i18n="clear_filters"');
    expect(productsHtml).toContain('<h3 data-i18n="categories">Kategoriyalar</h3>');
    expect(productsHtml).toContain('<span data-i18n="cat_analytical">Analytical Instruments</span>');
    expect(productsHtml).toContain('border: 1px solid rgba(0, 168, 225, 0.24) !important;');
    expect(productsHtml).toContain('.mobile-filter-clear::before');
    expect(productsHtml).toContain('.mobile-filter-clear:focus-visible');
    expect(productsHtml).toContain('appearance: none;');
    expect(productsHtml).toContain('id="mobileFilterBadge" hidden');
    expect(productsHtml).toContain('#categoryFilterOptions.filter-group');
    expect(productsHtml).toContain('grid-template-columns: repeat(3, minmax(0, 1fr)) !important;');
    expect(productsHtml).toContain('#categoryFilterOptions .cat-option');
    expect(productsHtml).toContain('flex-direction: column !important;');
    expect(productsHtml).toContain('@media (max-width: 370px)');
    expect(productsHtml).toContain("function updateMobileFilterBadge()");
    expect(productsHtml).toContain("function clearMobileFilters()");
    expect(productsHtml).toContain("badge.hidden = count === 0;");
    expect(productsHtml).toContain("transition: opacity 180ms ease, transform 220ms cubic-bezier(0.23, 1, 0.32, 1), visibility 0s linear 220ms;");
    expect(catalogHtml).toContain('class="catalog-mobile-filter-clear"');
    expect(catalogHtml).toContain("if (typeof updateI18n === 'function') updateI18n();");
    expect(catalogHtml).toContain('border: 1px solid rgba(0, 168, 225, 0.24) !important;');
    expect(catalogHtml).toContain('.catalog-mobile-filter-clear::before');
    expect(catalogHtml).toContain('.catalog-mobile-filter-clear:focus-visible');
    expect(catalogHtml).toContain('id="catalogMobileFilterTrigger"');
    expect(catalogHtml).toContain('id="catalogMobileFilterOptions"');
    expect(catalogHtml).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));');
    expect(catalogHtml).toContain('.catalog-mobile-filter-option');
    expect(catalogHtml).toContain('grid-column: 1 / -1;');
    expect(catalogHtml).toContain("cat-card-p.is-expanded");
    expect(catalogHtml).toContain("the first tap reveals the short description");
  });

  it("localizes browser titles across every public page", () => {
    const expectedTitles: Record<string, string> = {
      "about.html": "about_page_title",
      "blog.html": "news_page_title",
      "brands.html": "brands_page_title",
      "cart.html": "cart_page_title",
      "catalog.html": "catalog_page_title",
      "checkout.html": "checkout_page_title",
      "contact.html": "contact_page_title",
      "index.html": "home_page_title",
      "product-details.html": "product_details_page_title",
      "products.html": "products_page_title",
      "wishlist.html": "wishlist_page_title",
    };
    publicHtml.forEach(({ file, source }) => {
      expect(source, file).toContain(`<title data-i18n-title="${expectedTitles[file]}`);
    });
    expect(languageSource).toContain("document.querySelectorAll('[data-i18n-title]')");
    expect(languageSource).toContain('document.title = translatedTitle;');
  });

  it("keeps verified brand logos visible in narrow preview cards", () => {
    expect(brandsHtml).toContain(".brand-logo-container .verified-brand-logo");
    expect(brandsHtml).toContain("loading=\"eager\" decoding=\"async\"");
    expect(brandsHtml).toContain("@media (max-width: 576px)");
    expect(brandsHtml).toContain("grid-template-columns: repeat(2, minmax(0, 1fr)) !important;");
    expect(brandsHtml).toContain("max-height: 78px !important;");
    expect(verifiedBrandsSource).toContain("/assets/images/gtj_81cc4aba.png");
    expect(verifiedBrandsSource).toContain("/assets/images/ygyb_681d5e6d.png");
    expect(verifiedBrandsSource).toContain("/assets/images/scitek_665b073a.png");
    expect(verifiedBrandsSource).toContain("/assets/images/heal-force_f1a0570c.png");
    expect(verifiedBrandsSource).toContain("/assets/images/pruftechnik_c296e7b1.png");
  });

  it("provides compact Catalog and Contact mobile information patterns", () => {
    expect(mobileCss).toContain(".contact-page .contact-info .info-card.is-open");
    expect(contactHtml).toContain("const closeCards = () => cards.forEach(card => {");
    expect(contactHtml).toContain("card.setAttribute('aria-expanded', 'true')");
    expect(mobileCss).toContain(".nav-brand-name {\n    font-family: 'Outfit'");
    expect(mobileCss).toContain(".contact-page .contact-info .info-card::after");
  });

  it("converts mobile Contact info into an icon rail while preserving desktop cards", () => {
    expect(contactHtml).toContain('class="contact-info"');
    expect(contactHtml).toContain("event.preventDefault()");
    expect(contactHtml).toContain("const closeCards = () => cards.forEach(card => {");
    expect(contactHtml).toContain("document.addEventListener('click', event => {");
    expect(contactHtml).toContain("cards.some(card => card.contains(target))");
    expect(mobileCss).toContain(".contact-page .contact-info .info-card");
    expect(mobileCss).toContain("width: 50px !important;");
    expect(mobileCss).toContain(".contact-page .contact-info .info-card > div:nth-child(2) { display: none !important; }");
    expect(mobileCss).toContain(".contact-page .contact-info .info-card.is-open");
    expect(mobileCss).toContain("width: min(232px, calc(100vw - 92px)) !important;");
    expect(aboutHtml).not.toContain('/manus-storage/analytical_lab_5184ab68.png');
    expect(aboutHtml).not.toContain('/manus-storage/medical_lab_ebe6e814.png');
    expect(aboutHtml).not.toContain('/manus-storage/biology_lab_cfdc6325.png');
    expect(aboutHtml).not.toContain('class="solution-image"');
  });

  it("keeps the Catalog PDF modal controls inside narrow mobile screens", () => {
    expect(catalogHtml).toContain('class="pdf-modal-header"');
    expect(catalogHtml).toContain('class="pdf-modal-actions"');
    expect(mobileCss).toContain(".pdf-modal-content");
    expect(mobileCss).toContain("grid-template-columns: repeat(3, minmax(0, 40px)) minmax(0, 1fr)");
    expect(mobileCss).toContain(".pdf-modal-actions > button:last-child");
    expect(publicHtml.find(page => page.file === "catalog.html")?.source).toContain("styles.css?v=45.0");
  });

  it("protects the Product Details mobile layout and touch-friendly controls", () => {
    expect(productDetailsHtml).toContain('href="assets/css/styles.css?v=45.0"');
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

  it("uses a truthful founded-year hero badge instead of an experience claim", () => {
    const homeSource = publicHtml.find(page => page.file === "index.html")?.source ?? "";
    expect(homeSource).toContain('class="founded-badge-group"');
    expect(homeSource).toContain('class="founded-badge-wrap"');
    expect(homeSource).toContain('class="founded-badge"');
    expect(homeSource).toContain('<span class="num">2024</span>');
    expect(homeSource).toContain('data-i18n="founded_year_label"');
    expect(homeSource).toContain('aria-describedby="foundedBadgeTooltip"');
    expect(homeSource).toContain('data-i18n="founded_year_tooltip"');
    expect(homeSource).toContain('onclick="toggleFoundedBadgeTooltip(event)"');
    expect(homeSource).not.toContain('class="founded-about-link"');
    expect(homeSource).not.toContain('class="experience-badge"');
    expect(homeSource).not.toContain('data-i18n="years_experience"');
    expect(mobileCss).toContain("@keyframes founded-badge-pulse");
    expect(mobileCss).toContain("animation: founded-badge-pulse 3.8s ease-in-out infinite;");
    expect(mobileCss).toContain(".founded-badge-tooltip");
    expect(mobileCss).toContain(".founded-badge-wrap.is-tooltip-open .founded-badge-tooltip");
    expect(mobileCss).toContain("bottom: -8px;");
    expect(mobileCss).not.toContain(".founded-about-link");
    expect(mainSource).toContain("function toggleFoundedBadgeTooltip(event)");
    expect(mainSource).toContain("is-tooltip-open");
    expect(mobileCss).toContain(".hero .founded-badge-group {\n        right: 50%;\n        bottom: 8px;");
    expect(mobileCss).toContain(".founded-badge {\n        animation: none;");
    expect(languageSource).toContain('founded_year_label: "Founded in"');
    expect(languageSource).toContain('founded_year_label: "Tashkil topgan yil"');
    expect(languageSource).toContain('founded_year_label: "Год основания"');
    expect(languageSource).toContain('founded_year_aria: "Founded in 2024"');
    expect(languageSource).toContain('founded_year_tooltip: "Since 2024, FYZEN-LAB has combined verified medical and laboratory equipment with practical guidance."');
    expect(languageSource).toContain('founded_year_aria: "2024-yilda tashkil topgan"');
    expect(languageSource).toContain('founded_year_tooltip: "2024-yildan beri FYZEN-LAB tasdiqlangan tibbiy va laboratoriya uskunalarini amaliy maslahat bilan birlashtiradi."');
    expect(languageSource).toContain('founded_year_aria: "Основан в 2024 году"');
    expect(languageSource).toContain('founded_year_tooltip: "С 2024 года FYZEN-LAB объединяет проверенное медицинское и лабораторное оборудование с практическими рекомендациями."');
  });

  it("shows the Khorezm address and WhatsApp instead of Facebook across public contact surfaces", () => {
    for (const { file, source } of publicHtml) {
      expect(source, file).toContain('data-i18n="footer_address"');
      expect(source, file).toContain("Xorazm, O‘zbekiston");
      expect(source, file).not.toContain('title="Facebook"');
      expect(source, file).toContain('href="https://wa.me/998990342002"');
      expect(source, file).toContain('title="WhatsApp"');
    }
    expect(languageSource).toContain('"footer_address": "Khorezm, Uzbekistan"');
    expect(languageSource).toContain('"footer_address": "Xorazm, O‘zbekiston"');
    expect(languageSource).toContain('"footer_address": "Хорезм, Узбекистан"');
  });
});
