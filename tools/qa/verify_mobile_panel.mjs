import { chromium } from "playwright";
import assert from "node:assert/strict";

const baseUrl = "https://3000-idoosqu28lnue7qss1a3m-e8b50e28.us5.manus.computer";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

try {
  await page.goto(`${baseUrl}/index.html?mobile-panel-test=1`, { waitUntil: "networkidle" });
  const toggle = page.locator(".menu-toggle");
  const drawer = page.locator("#mobileNavOverlay");
  const backdrop = page.locator("#mobileNavBackdrop");

  await toggle.click();
  await page.waitForTimeout(380);
  assert.equal(await drawer.evaluate(el => el.classList.contains("active")), true, "drawer opens");
  assert.equal(await backdrop.evaluate(el => el.classList.contains("active")), true, "backdrop opens");
  assert.equal(await toggle.getAttribute("aria-expanded"), "true", "aria-expanded is true");

  const dropdownArrow = page.locator(".mobile-nav-arrow");
  await dropdownArrow.click();
  assert.equal(await page.locator(".mobile-nav-dropdown").evaluate(el => el.classList.contains("open")), true, "submenu opens");
  await dropdownArrow.click();
  assert.equal(await page.locator(".mobile-nav-dropdown").evaluate(el => el.classList.contains("open")), false, "submenu closes");

  await page.keyboard.press("Escape");
  assert.equal(await drawer.evaluate(el => el.classList.contains("active")), false, "Escape closes drawer");

  await toggle.click();
  await page.waitForTimeout(380);
  await page.mouse.click(2, 400);
  await page.waitForTimeout(380);
  assert.equal(await drawer.evaluate(el => el.classList.contains("active")), false, "backdrop closes drawer");

  await toggle.click();
  await page.waitForTimeout(380);
  const brandLink = page.locator('#mobileNavOverlay a[href^="brands.html"]');
  assert.ok(await brandLink.getAttribute("href"), "brands link has href");
  await brandLink.click();
  await page.waitForLoadState("domcontentloaded");
  assert.match(page.url(), /brands\.html/, "brands navigation works");

  console.log("MOBILE_PANEL_INTERACTIONS=passed");
} finally {
  await browser.close();
}
