import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("https://3000-idoosqu28lnue7qss1a3m-e8b50e28.us5.manus.computer/index.html?mobile-hero-debug=1", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
const data = await page.locator(".experience-badge").evaluate(el => {
  const r = el.getBoundingClientRect();
  const s = getComputedStyle(el);
  const parent = el.parentElement?.getBoundingClientRect();
  return {
    rect: { x: r.x, y: r.y, width: r.width, height: r.height },
    parent: parent ? { x: parent.x, y: parent.y, width: parent.width, height: parent.height } : null,
    position: s.position,
    inset: { top: s.top, right: s.right, bottom: s.bottom, left: s.left },
    transform: s.transform,
    display: s.display,
    margin: s.margin,
    animation: s.animationName,
    cssSheets: [...document.styleSheets].map(sheet => sheet.href).filter(Boolean),
  };
});
console.log(JSON.stringify(data));
await browser.close();
