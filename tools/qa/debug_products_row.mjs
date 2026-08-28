import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("https://3000-ii17i7r3w8hhw969gazsx-24be962.us4.manus.computer/index.html?products-row-debug=1", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(900);
await page.locator(".menu-toggle").click();
await page.waitForTimeout(350);
const arrow = page.locator("#mobileNavOverlay .mobile-nav-arrow");
console.log("arrowCount", await arrow.count());
console.log("handlerType", await page.evaluate(() => typeof window.toggleMobileSubMenu));
page.on("console", message => console.log("browserConsole", message.type(), message.text()));
console.log("childRects", await page.locator("#mobileNavOverlay .mobile-nav-dropdown-toggle").evaluate(el => [...el.children].map(child => ({ tag: child.tagName, className: child.className, rect: (() => { const r = child.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; })(), zIndex: getComputedStyle(child).zIndex, position: getComputedStyle(child).position }))));
console.log("arrowRect", await arrow.evaluate(el => {
  const rect = el.getBoundingClientRect();
  const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, hit: hit?.outerHTML?.slice(0, 120) };
}));
console.log("before", await page.locator("#mobileNavOverlay .mobile-nav-dropdown").evaluate(el => {
  const toggle = el.querySelector(".mobile-nav-dropdown-toggle");
  const rect = toggle.getBoundingClientRect();
  const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  return { className: el.className, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }, hit: hit?.outerHTML?.slice(0, 160), pointerEvents: getComputedStyle(toggle).pointerEvents, html: toggle.outerHTML };
}));
await arrow.click();
await page.waitForTimeout(180);
console.log("after", await page.locator("#mobileNavOverlay .mobile-nav-dropdown").evaluate(el => ({ className: el.className, menuDisplay: getComputedStyle(el.querySelector(".mobile-nav-dropdown-menu")).display })));
await browser.close();
