import { chromium } from "playwright";
import assert from "node:assert/strict";

const baseUrl = "https://3000-ii17i7r3w8hhw969gazsx-24be9626.us4.manus.computer";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.addInitScript(() => {
  Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => { window.__copiedShareLink = true; } }, configurable: true });
});

try {
  await page.goto(`${baseUrl}/products.html?product-details-audit=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(450);
  const firstProduct = page.locator(".product-card").first();
  await firstProduct.waitFor({ state: "visible" });
  await Promise.all([
    page.waitForURL(/product-details\.html\?id=/),
    firstProduct.click(),
  ]);
  await page.waitForTimeout(500);

  for (const width of [375, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.waitForTimeout(200);
    const result = await page.evaluate(() => {
      const visible = el => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
      };
      const title = document.querySelector("h1, .product-title, [data-product-title]");
      const image = document.querySelector(".product-image, .product-img, img[alt]");
      return {
        url: location.href,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        titleVisible: Boolean(title && visible(title)),
        imageVisible: Boolean(image && visible(image)),
        quantityVisible: Boolean(document.querySelector("#productQty") && visible(document.querySelector("#productQty"))),
        actionVisible: Boolean(document.querySelector("#addToCartBtn") && visible(document.querySelector("#addToCartBtn"))),
        quantityValue: document.querySelector("#productQty")?.value,
      };
    });
    assert.ok(result.overflow <= 1, `${width}px detail route has overflow: ${result.overflow}px`);
    assert.equal(result.titleVisible, true, `${width}px detail title is not visible`);
    assert.equal(result.imageVisible, true, `${width}px detail image is not visible`);
    assert.equal(result.quantityVisible, true, `${width}px quantity control is not visible`);
    assert.equal(result.actionVisible, true, `${width}px add-to-cart action is not visible`);
    assert.equal(await page.locator("#productWishlistBtn").getAttribute("aria-pressed"), "false", `${width}px wishlist starts in the wrong state`);
    await page.locator("#productWishlistBtn").click();
    assert.equal(await page.locator("#productWishlistBtn").getAttribute("aria-pressed"), "true", `${width}px wishlist add failed`);
    assert.ok(await page.locator("#productWishlistBtn").evaluate(button => button.classList.contains("active")), `${width}px wishlist active class is missing`);
    await page.locator("#productWishlistBtn").click();
    assert.equal(await page.locator("#productWishlistBtn").getAttribute("aria-pressed"), "false", `${width}px wishlist remove failed`);
    await page.locator("#copyShareLink").click();
    await page.waitForTimeout(140);
    assert.ok(await page.locator(".fyz-toast.success.active").filter({ hasText: "Link copied" }).last().isVisible(), `${width}px copy success toast is not visible`);
    assert.ok(await page.locator("#shareTelegram").getAttribute("href").then(href => href?.startsWith("https://t.me/share/url")), `${width}px Telegram share link is missing`);
    assert.ok(await page.locator("#shareWhatsApp").getAttribute("href").then(href => href?.startsWith("https://wa.me/")), `${width}px WhatsApp share link is missing`);
    assert.ok(await page.locator("#shareFacebook").getAttribute("href").then(href => href?.includes("facebook.com/sharer")), `${width}px Facebook share link is missing`);
    const contactHrefs = await page.locator("#fyzenContactMenu a").evaluateAll(links => links.map(link => link.getAttribute("href")));
    assert.ok(contactHrefs.includes("https://t.me/fyzen_lab"), `${width}px verified Telegram contact link is missing`);
    assert.ok(contactHrefs.includes("https://www.instagram.com/fyzen_lab?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="), `${width}px verified Instagram contact link is missing`);
    assert.ok(contactHrefs.includes("https://wa.me/998990342002"), `${width}px verified WhatsApp contact link is missing`);
    assert.ok(contactHrefs.includes("tel:+998990342002"), `${width}px phone contact link is missing`);
    assert.ok(contactHrefs.includes("mailto:info@fyzen-lab.uz"), `${width}px email contact link is missing`);
    assert.ok(await page.locator("#similarProductsSection").isVisible(), `${width}px similar products section is not visible`);
    assert.ok(await page.locator(".p-similar-card").count() > 0, `${width}px similar products cards are missing`);
    assert.equal(result.quantityValue, "1", `${width}px quantity does not start at one`);
    await page.locator("#increaseQtyBtn").click();
    assert.equal(await page.locator("#productQty").inputValue(), "2", `${width}px quantity increment failed`);
    await page.locator("#decreaseQtyBtn").click();
    assert.equal(await page.locator("#productQty").inputValue(), "1", `${width}px quantity decrement failed`);
    for (const lang of ["uz", "ru", "en"]) {
      await page.evaluate((nextLang) => window.changeLanguage(nextLang), lang);
      await page.waitForTimeout(60);
      const labels = await page.evaluate(() => ({
        quantity: document.querySelector("#productQty")?.getAttribute("aria-label"),
        increase: document.querySelector("#increaseQtyBtn")?.getAttribute("aria-label"),
        decrease: document.querySelector("#decreaseQtyBtn")?.getAttribute("aria-label"),
      }));
      assert.ok(labels.quantity && labels.increase && labels.decrease, `${width}px ${lang} quantity accessibility labels are missing`);
    }
    await page.locator(".p-feature-card").first().click();
    assert.equal(await page.locator("#infoModalOverlay").first().getAttribute("aria-hidden"), "false", `${width}px info modal did not open accessibly`);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#infoModalOverlay").first().getAttribute("aria-hidden"), "true", `${width}px info modal did not close with Escape`);
    await page.locator("#viewContainer2D").click();
    assert.equal(await page.locator("#zoomModal").getAttribute("aria-hidden"), "false", `${width}px zoom modal did not open accessibly`);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#zoomModal").getAttribute("aria-hidden"), "true", `${width}px zoom modal did not close with Escape`);
    console.log(JSON.stringify({ width, ...result }));
  }
  console.log("PRODUCT_DETAILS_MOBILE=passed");
} finally {
  await browser.close();
}
