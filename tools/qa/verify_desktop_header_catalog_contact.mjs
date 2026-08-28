import { chromium } from "playwright";
import assert from "node:assert/strict";

const baseUrl = "https://3000-ii17i7r3w8hhw969gazsx-24be9626.us4.manus.computer";
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const path of ["/index.html", "/catalog.html", "/contact.html"]) {
    await page.goto(`${baseUrl}${path}?desktop-audit=1`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      navWidth: document.querySelector(".nav-inner")?.getBoundingClientRect().width ?? 0,
      chat: Boolean(document.querySelector("#fyzenFabMain")),
    }));
    assert.ok(state.overflow <= 1, `${path} desktop horizontal overflow ${state.overflow}`);
    assert.ok(state.navWidth <= 1280, `${path} desktop header exceeds viewport`);
    assert.equal(state.chat, true, `${path} desktop chat trigger missing`);
  }
  await page.goto(`${baseUrl}/catalog.html?desktop-audit=1`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".categories-grid-p .cat-card-p").count(), 12, "desktop Catalog cards changed");
  assert.equal(await page.locator(".categories-grid-p").evaluate(el => getComputedStyle(el).display), "grid", "desktop Catalog grid layout changed unexpectedly");
  assert.notEqual(await page.locator(".cat-card-p").first().evaluate(el => getComputedStyle(el).display), "none", "desktop Catalog cards are hidden");
  await page.goto(`${baseUrl}/contact.html?desktop-audit=1`, { waitUntil: "networkidle" });
  const infoValue = page.locator(".contact-info .info-card .info-value").first();
  assert.equal(await infoValue.evaluate(el => getComputedStyle(el).opacity), "1", "desktop Contact details are hidden");
  console.log("HEADER_CATALOG_CONTACT_DESKTOP=passed");
} finally {
  await browser.close();
}
