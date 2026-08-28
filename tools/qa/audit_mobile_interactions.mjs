import { chromium } from "playwright";
import assert from "node:assert/strict";

const base = process.env.FYZEN_PREVIEW_URL || "https://3000-ii17i7r3w8hhw969gazsx-24be962.us4.manus.computer";
const widths = [375, 390];
const browser = await chromium.launch({ headless: true });
const results = [];
async function openPage(page, path) {
  await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 20000 });
  await page.waitForTimeout(220);
}
try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
    await context.addInitScript(() => localStorage.setItem("fyzen_lang", "en"));
    const page = await context.newPage();

    await openPage(page, "/index.html?interaction-audit=home");
    await page.locator(".menu-toggle").click();
    assert.equal(await page.locator("#mobileNavOverlay").getAttribute("aria-hidden"), "false", `${width}px Home drawer did not open`);
    await page.locator("#mobileNavOverlay .mobile-nav-arrow").click();
    assert.equal(await page.locator("#mobileNavOverlay .mobile-nav-dropdown").evaluate(el => el.classList.contains("open")), true, `${width}px Home Products accordion did not open`);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#mobileNavOverlay").getAttribute("aria-hidden"), "true", `${width}px Home drawer Escape did not close`);

    await openPage(page, "/products.html?interaction-audit=products");
    await page.locator("#mobileFilterTrigger").click();
    assert.equal(await page.locator("#mobileFilterTrigger").getAttribute("aria-expanded"), "true", `${width}px Products filter did not open`);
    await page.locator("#categoryFilterOptions .cat-option").nth(1).click();
    assert.equal(await page.locator("#mobileFilterTrigger").getAttribute("aria-expanded"), "false", `${width}px Products filter did not close after selection`);
    await page.locator("#mobileFilterTrigger").click();
    await page.locator("#mobileFilterClear").click();
    assert.equal(await page.locator("#mobileFilterBadge").getAttribute("hidden"), "", `${width}px Products filter clear did not reset badge`);

    await openPage(page, "/catalog.html?interaction-audit=catalog");
    const firstCatalogRow = page.locator(".cat-card-p").first();
    await firstCatalogRow.click();
    assert.equal(await firstCatalogRow.evaluate(el => el.classList.contains("is-expanded")), true, `${width}px Catalog row did not expand on first tap`);
    await firstCatalogRow.click();
    await page.waitForTimeout(120);
    assert.equal(await page.locator("#pdfModal").evaluate(el => getComputedStyle(el).display), "flex", `${width}px Catalog row did not open PDF modal on second tap`);
    await page.locator("#pdfModal button[onclick*=closePdfModal]").click();
    assert.equal(await page.locator("#pdfModal").evaluate(el => getComputedStyle(el).display), "none", `${width}px Catalog PDF modal did not close`);

    await openPage(page, "/blog.html?interaction-audit=news");
    await page.locator(".read-more-btn").first().click();
    assert.equal(await page.locator("#newsModal").evaluate(el => el.classList.contains("active")), true, `${width}px News modal did not open`);
    assert.ok((await page.locator("#modalTitle").textContent()).trim().length > 2, `${width}px News modal title is empty`);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#newsModal").evaluate(el => el.classList.contains("active")), false, `${width}px News modal Escape did not close`);

    await openPage(page, "/contact.html?interaction-audit=contact");
    const contactCard = page.locator(".contact-info .info-card").nth(1);
    await contactCard.click();
    assert.equal(await contactCard.getAttribute("aria-expanded"), "true", `${width}px Contact accordion did not open`);
    const contactForm = page.locator("#contactForm");
    assert.equal(await contactForm.evaluate(form => form.checkValidity()), false, `${width}px Contact form incorrectly validates empty submission`);
    assert.ok(await page.locator("#contactName").isVisible(), `${width}px Contact name field is not visible`);

    await page.evaluate(() => localStorage.setItem("fyzen_cart", JSON.stringify([{ id: 11, name: "Mobile audit item", quantity: 1, price: 0 }])));
    await openPage(page, "/checkout.html?interaction-audit=checkout");
    const checkoutForm = page.locator("#inquiryForm");
    assert.equal(await checkoutForm.evaluate(form => form.checkValidity()), false, `${width}px Checkout form incorrectly validates empty submission`);
    assert.ok(await page.locator("#custName").isVisible(), `${width}px Checkout name field is not visible`);
    assert.ok(await page.locator("#custPhone").isVisible(), `${width}px Checkout phone field is not visible`);

    await page.evaluate(() => localStorage.removeItem("fyzen_cart"));
    await openPage(page, "/cart.html?interaction-audit=cart");
    const expectedCartEmpty = {
      en: { title: "Your cart is empty", description: "You haven't selected any products yet.", cta: "View Products" },
      uz: { title: "Savatchangiz bo'sh", description: "Siz hali hech qanday mahsulotni tanlamadingiz.", cta: "Ko'rish" },
      ru: { title: "Ваша корзина пуста", description: "Вы пока не выбрали ни одного товара.", cta: "Продукты" },
    };
    for (const lang of ["ru", "uz", "en"]) {
      await page.evaluate(nextLang => window.changeLanguage(nextLang), lang);
      await page.waitForTimeout(60);
      const cartEmptyText = await page.locator("#cartContent").evaluate(container => ({
        title: container.querySelector("h2")?.textContent?.trim(),
        description: container.querySelector("p")?.textContent?.trim(),
        cta: container.querySelector("a")?.textContent?.trim(),
      }));
      assert.deepEqual(cartEmptyText, expectedCartEmpty[lang], `${width}px Cart empty-state is not synchronized in ${lang}`);
    }
    assert.ok(await page.locator("#cartContent a").isVisible(), `${width}px Cart empty CTA is not visible`);

    await openPage(page, "/wishlist.html?interaction-audit=wishlist");
    assert.ok(await page.getByText(/Explore Products|Mahsulotlarni ko'rish|Посмотреть товары/i).first().isVisible(), `${width}px Wishlist empty CTA is not visible`);

    await openPage(page, "/brands.html?interaction-audit=brands");
    const brandButton = page.locator(".brand-btn").first();
    assert.ok(await brandButton.isVisible(), `${width}px Brands first CTA is not visible`);
    await brandButton.click();
    await page.waitForLoadState("domcontentloaded");
    assert.match(page.url(), /products\.html\?brand=/, `${width}px Brands CTA did not navigate to filtered products`);

    results.push({ width, passed: true });
    await context.close();
  }
  console.log(JSON.stringify(results));
  console.log("MOBILE_INTERACTIONS_ALL_PAGES=passed");
} finally {
  await browser.close();
}
