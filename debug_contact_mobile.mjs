import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
await page.goto("https://3000-idoosqu28lnue7qss1a3m-e8b50e28.us5.manus.computer/contact.html?contact-mobile-debug=1", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const data = await page.evaluate(() => {
  const get = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return { sel, rect: { x:r.x, y:r.y, width:r.width, height:r.height }, padding:s.padding, margin:s.margin, display:s.display, position:s.position, zIndex:s.zIndex, overflow:s.overflow };
  };
  return { navbar:get('.navbar'), header:get('.page-header'), title:get('.page-title'), section:get('.contact-section'), styleSheets:[...document.styleSheets].map(s=>s.href).filter(Boolean) };
});
console.log(JSON.stringify(data));
await browser.close();
