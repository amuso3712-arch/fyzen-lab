import { chromium } from "playwright";
const base = "https://3000-idoosqu28lnue7qss1a3m-e8b50e28.us5.manus.computer/contact.html?debug-blank-i18n=1";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
await context.addInitScript(() => localStorage.setItem("fyzen_lang", "en"));
const page = await context.newPage();
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(350);
console.log(await page.evaluate(() => [...document.querySelectorAll("[data-i18n]")].map((el) => {
  const style = getComputedStyle(el); const rect = el.getBoundingClientRect();
  return { tag: el.tagName, id: el.id, className: el.className, key: el.dataset.i18n, text: el.textContent, display: style.display, visibility: style.visibility, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } };
}).filter((item) => item.display !== "none" && item.visibility !== "hidden" && item.rect.width > 0 && item.rect.height > 0 && !item.text.trim())));
await context.close();
await browser.close();
