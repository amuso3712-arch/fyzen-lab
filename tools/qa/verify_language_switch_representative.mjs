import { chromium } from "playwright";
const base = "https://3000-ii17i7r3w8hhw969gazsx-24be9626.us4.manus.computer";
const pages = [["home", "/index.html"], ["about", "/about.html"], ["contact", "/contact.html"]];
const sequence = [["UZ", "uz"], ["RU", "ru"], ["EN", "en"]];
const browser = await chromium.launch({ headless: true });
const failures = [];
let passed = 0;
for (const width of [375, 390]) {
  for (const [pageName, path] of pages) {
    const context = await browser.newContext({ viewport: { width, height: 844 } });
  await context.addInitScript(() => localStorage.setItem("fyzen_lang", "en"));
  const page = await context.newPage();
  await page.goto(`${base}${path}?representative-language-switch=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(250);
  for (const [label, expected] of sequence) {
    const overlay = page.locator("#mobileNavOverlay");
    if (!(await overlay.evaluate((el) => el.classList.contains("active")))) {
      await page.locator(".menu-toggle").click();
      await page.waitForTimeout(220);
    }
    await page.locator(`.mobile-lang-switcher .lang-btn:has-text("${label}")`).first().click();
    await page.waitForTimeout(180);
    const result = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      scrollWidth: document.documentElement.scrollWidth,
      viewport: innerWidth,
      bodyTextLength: document.body.innerText.trim().length,
    }));
    const ok = result.lang === expected && result.scrollWidth <= result.viewport + 1 && result.bodyTextLength > 40;
    if (ok) passed += 1;
    else failures.push({ page: pageName, width, label, expected, result });
    }
    await context.close();
  }
}
console.log(JSON.stringify({ passed, total: pages.length * sequence.length * 2, failures }, null, 2));
await browser.close();
if (failures.length) process.exit(1);
