import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("https://3000-idoosqu28lnue7qss1a3m-e8b50e28.us5.manus.computer/admin.html?admin-mobile-debug=1", { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.locator("#adminLoginScreen").evaluate(el => el.classList.add("hidden"));
await page.locator(".admin-menu-toggle").click();
await page.waitForTimeout(300);
const data = await page.evaluate(() => {
  const get = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return { sel, rect: { x:r.x, y:r.y, width:r.width, height:r.height }, zIndex:s.zIndex, pointerEvents:s.pointerEvents, opacity:s.opacity, visibility:s.visibility, transform:s.transform };
  };
  const target = document.elementFromPoint(370, 400);
  return { body: document.body.className, sidebar: get('.admin-sidebar'), scrim: get('.admin-sidebar-scrim'), target: target ? { id: target.id, className: target.className, tag: target.tagName } : null };
});
console.log(JSON.stringify(data));
await browser.close();
