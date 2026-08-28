import { chromium } from "playwright";
const base = "https://3000-ii17i7r3w8hhw969gazsx-24be9626.us4.manus.computer/about.html?language-switch=1";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
await context.addInitScript(() => localStorage.setItem("fyzen_lang", "en"));
const page = await context.newPage();
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(250);
const results = [];
for (const [label, expected] of [["UZ", "uz"], ["RU", "ru"], ["EN", "en"]]) {
  const overlay = page.locator("#mobileNavOverlay");
  if (!(await overlay.evaluate((el) => el.classList.contains("active")))) {
    await page.locator(".menu-toggle").click();
    await page.waitForTimeout(220);
  }
  const button = page.locator(`.mobile-lang-switcher .lang-btn:has-text("${label}")`).first();
  await button.click();
  await page.waitForTimeout(180);
  const result = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.querySelector(".company-text h1")?.innerText || "",
    scrollWidth: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  results.push({ label, expected, ...result, passed: result.lang === expected && result.scrollWidth <= result.viewport + 1 && result.title.length > 10 });
}
console.log(JSON.stringify(results, null, 2));
await context.close();
await browser.close();
if (results.some((item) => !item.passed)) process.exit(1);
