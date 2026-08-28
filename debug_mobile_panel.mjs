import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
await page.goto("https://3000-idoosqu28lnue7qss1a3m-e8b50e28.us5.manus.computer/index.html?mobile-panel-debug=1", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.locator(".menu-toggle").click();
const data = await page.locator("#mobileNavOverlay").evaluate(el => {
  const r = el.getBoundingClientRect();
  const s = getComputedStyle(el);
  const backdrop = document.getElementById('mobileNavBackdrop');
  const b = backdrop?.getBoundingClientRect();
  const bs = backdrop ? getComputedStyle(backdrop) : null;
  const target = document.elementFromPoint(2, 400);
  return { rect: { x: r.x, y: r.y, width: r.width, height: r.height }, right: s.right, transform: s.transform, visibility: s.visibility, opacity: s.opacity, pointerEvents: s.pointerEvents, zIndex: s.zIndex, backdrop: b ? { x: b.x, y: b.y, width: b.width, height: b.height } : null, backdropStyle: bs ? { zIndex: bs.zIndex, pointerEvents: bs.pointerEvents, opacity: bs.opacity } : null, pointTarget: target ? { id: target.id, className: target.className } : null };
});
const loader = await page.locator("#loader").evaluate(el => ({ display: getComputedStyle(el).display, opacity: getComputedStyle(el).opacity, pointerEvents: getComputedStyle(el).pointerEvents }));
const links = await page.locator('#mobileNavOverlay a').evaluateAll(els => els.map(el => ({ text: el.textContent?.trim(), key: el.getAttribute('data-i18n'), href: el.getAttribute('href') })));
console.log(JSON.stringify({ data, loader, links }));
await browser.close();
