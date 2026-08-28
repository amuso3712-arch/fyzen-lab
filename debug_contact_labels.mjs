import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.addInitScript(() => localStorage.setItem("fyzen_lang", "uz"));
  await page.goto("https://3000-ii17i7r3w8hhw969gazsx-24be9626.us4.manus.computer/contact.html?debug-labels=1", { waitUntil: "networkidle" });
  console.log(await page.locator(".contact-info .info-card").first().innerText());
  console.log(await page.locator(".nav-links").innerText());
} finally { await browser.close(); }
