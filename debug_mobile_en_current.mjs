import { chromium } from "playwright";
const base = "https://3000-ii17i7r3w8hhw969gazsx-24be9626.us4.manus.computer/about.html?debug-en=1";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
await context.addInitScript(() => localStorage.setItem("fyzen_lang", "uz"));
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(350);
const before = await page.evaluate(() => ({
  lang: document.documentElement.lang,
  stored: localStorage.getItem("fyzen_lang"),
  title: document.querySelector(".company-text h1")?.innerText || "",
  buttons: [...document.querySelectorAll("#mobileNavOverlay .mobile-lang-switcher .lang-btn")].map((el) => ({ text: el.textContent.trim(), className: el.className, disabled: el.disabled, outer: el.outerHTML })),
  drawerActive: document.querySelector("#mobileNavOverlay")?.classList.contains("active"),
}));
await page.locator(".menu-toggle").click();
await page.waitForTimeout(250);
const en = page.locator("#mobileNavOverlay .mobile-lang-switcher .lang-btn").filter({ hasText: "EN" }).first();
await en.click();
await page.waitForTimeout(500);
const after = await page.evaluate(() => ({
  lang: document.documentElement.lang,
  stored: localStorage.getItem("fyzen_lang"),
  title: document.querySelector(".company-text h1")?.innerText || "",
  drawerActive: document.querySelector("#mobileNavOverlay")?.classList.contains("active"),
  activeButtons: [...document.querySelectorAll("#mobileNavOverlay .mobile-lang-switcher .lang-btn")].filter((el) => el.classList.contains("active-lang")).map((el) => el.textContent.trim()),
}));
console.log(JSON.stringify({ before, after, errors }, null, 2));
await context.close();
await browser.close();
if (after.lang !== "en" || after.stored !== "en") process.exit(1);
