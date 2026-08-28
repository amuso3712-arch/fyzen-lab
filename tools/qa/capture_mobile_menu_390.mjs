import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await page.goto("https://3000-ii17i7r3w8hhw969gazsx-24be962.us4.manus.computer/index.html?mobile-menu-capture-390=1", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(900);
await page.locator(".menu-toggle").click();
await page.waitForTimeout(350);
const result = await page.locator("#mobileNavOverlay").evaluate(el => {
  const links = [...el.querySelectorAll(':scope > a, :scope > .mobile-nav-dropdown > .mobile-nav-dropdown-toggle')];
  const drawer = el.getBoundingClientRect();
  const products = links.find(item => item.textContent.includes('Products') || item.textContent.includes('Mahsulot') || item.textContent.includes('Продукты'));
  const pr = products?.getBoundingClientRect();
  const arrow = products?.querySelector('.mobile-nav-arrow')?.getBoundingClientRect();
  return {
    drawer: { x: drawer.x, width: drawer.width, right: drawer.right },
    itemWidths: links.map(item => Math.round(item.getBoundingClientRect().width)),
    products: pr ? { width: pr.width, left: pr.left, right: pr.right } : null,
    arrow: arrow ? { left: arrow.left, right: arrow.right } : null,
    submenuInitiallyClosed: !products?.parentElement?.classList.contains('open'),
  };
});
assert.ok(result.drawer.right <= 390, 'drawer exceeds 390px viewport');
assert.ok(result.products, 'Products row is missing at 390px');
assert.equal(result.products.width, 148, 'Products row is not equal to the sibling menu width');
assert.ok(result.itemWidths.every(width => width === 148), `Top-level menu widths are not equal: ${result.itemWidths.join(', ')}`);
assert.ok(result.arrow && result.arrow.right <= result.products.right - 8, 'Products arrow is not inset from the row edge');
assert.equal(result.submenuInitiallyClosed, true, 'Products submenu should start collapsed');
await page.locator('.mobile-nav-arrow').click();
await page.waitForTimeout(120);
assert.equal(await page.locator('.mobile-nav-dropdown').evaluate(el => el.classList.contains('open')), true, 'Products submenu did not open');
await page.screenshot({ path: "/home/ubuntu/mobile-menu-final-390.png", fullPage: false });
console.log(JSON.stringify({ viewport: 390, ...result, submenuAfterClick: true }));
console.log('MOBILE_MENU_390=passed');
await browser.close();
