import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
await page.goto("https://3000-idoosqu28lnue7qss1a3m-e8b50e28.us5.manus.computer/index.html?mobile-css-debug=1", { waitUntil: "networkidle" });
await page.waitForTimeout(900);
await page.locator(".menu-toggle").click();
await page.waitForTimeout(350);
const data = await page.evaluate(() => {
  const overlay = document.querySelector('#mobileNavOverlay');
  const s = getComputedStyle(overlay);
  const rules = [];
  for (const sheet of document.styleSheets) {
    let cssRules;
    try { cssRules = sheet.cssRules; } catch { continue; }
    for (const rule of cssRules) {
      if (rule.selectorText?.includes('.mobile-nav') && overlay.matches(rule.selectorText)) {
        rules.push({ selector: rule.selectorText, css: rule.cssText });
      }
      if (rule.cssRules) {
        for (const nested of rule.cssRules) {
          if (nested.selectorText?.includes('.mobile-nav') && overlay.matches(nested.selectorText)) rules.push({ selector: nested.selectorText, css: nested.cssText });
        }
      }
    }
  }
  return { className: overlay.className, right: s.right, left:s.left, position:s.position, rules:rules.slice(-30) };
});
console.log(JSON.stringify(data));
await browser.close();
