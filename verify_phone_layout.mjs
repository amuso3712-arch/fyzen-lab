import { chromium } from "playwright";
import assert from "node:assert/strict";

const baseUrl = "https://3000-ii17i7r3w8hhw969gazsx-24be9626.us4.manus.computer";
const publicPages = [
  "/index.html",
  "/brands.html",
  "/blog.html",
  "/about.html",
  "/contact.html",
  "/catalog.html",
  "/products.html",
  "/cart.html",
  "/checkout.html",
  "/wishlist.html",
  "/product-details.html",
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  for (const path of publicPages) {
    await page.goto(`${baseUrl}${path}?phone-audit=1`, { waitUntil: "networkidle" });
    await page.waitForTimeout(250);
    const result = await page.evaluate(() => {
      const width = window.innerWidth;
      const overflow = document.documentElement.scrollWidth - width;
      const header = document.querySelector(".nav-inner");
      const headerRect = header?.getBoundingClientRect();
      const interactive = [...document.querySelectorAll("button, a, input, textarea, select")]
        .filter(el => {
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
        });
      return {
        overflow,
        headerWithinViewport: !headerRect || headerRect.right <= width + 1,
        hasReachableInteractive: interactive.length > 0,
        chatTriggerVisible: Boolean(document.querySelector("#fyzenFabMain")),
      };
    });
    assert.ok(result.overflow <= 1, `${path} has horizontal overflow: ${result.overflow}px`);
    assert.equal(result.headerWithinViewport, true, `${path} header exceeds viewport`);
    assert.equal(result.hasReachableInteractive, true, `${path} has no reachable interactive content`);
    assert.equal(result.chatTriggerVisible, true, `${path} is missing the floating chat trigger`);
  }

  await page.goto(`${baseUrl}/admin.html?phone-admin-audit=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const adminLoginScreen = page.locator("#adminLoginScreen");
  if (await adminLoginScreen.count()) await adminLoginScreen.evaluate(el => el.classList.add("hidden"));
  const adminBefore = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    toggleVisible: getComputedStyle(document.querySelector(".admin-menu-toggle")).display !== "none",
    mainWidth: document.querySelector(".admin-main")?.getBoundingClientRect().width,
  }));
  assert.ok(adminBefore.overflow <= 1, `admin has horizontal overflow: ${adminBefore.overflow}px`);
  assert.equal(adminBefore.toggleVisible, true, "admin mobile menu toggle is hidden");
  assert.ok(adminBefore.mainWidth <= 390, `admin main exceeds viewport: ${adminBefore.mainWidth}px`);

  await page.locator(".admin-menu-toggle").click();
  await page.waitForTimeout(280);
  assert.equal(await page.locator("body").evaluate(el => el.classList.contains("admin-sidebar-open")), true, "admin sidebar opens");
  await page.mouse.click(370, 400);
  await page.waitForTimeout(100);
  assert.equal(await page.locator("body").evaluate(el => el.classList.contains("admin-sidebar-open")), false, "admin sidebar closes from scrim");

  console.log("PHONE_LAYOUT_RESPONSIVE=passed");
} finally {
  await browser.close();
}
