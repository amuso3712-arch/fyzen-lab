import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("https://3000-idoosqu28lnue7qss1a3m-e8b50e28.us5.manus.computer/index.html?mobile-hero-debug-2=1", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
const data = await page.evaluate(() => {
  const get = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return { sel, rect: { x:r.x, y:r.y, width:r.width, height:r.height }, display:s.display, position:s.position, grid:s.gridTemplateColumns, flex:s.flexDirection, gap:s.gap };
  };
  return ['.hero', '.hero-inner', '.hero-content', '.hero-btns', '.hero-btns a:first-child', '.hero-btns a:last-child', '.experience-badge'].map(get);
});
console.log(JSON.stringify(data));
await browser.close();
