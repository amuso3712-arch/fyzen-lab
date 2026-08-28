import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
try {
  for (const lang of ["uz", "ru", "en"]) {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.addInitScript(language => localStorage.setItem("fyzen_lang", language), lang);
    await page.goto(`https://3000-ii17i7r3w8hhw969gazsx-24be962.us4.manus.computer/contact.html?labels=${lang}`, { waitUntil: "networkidle" });
    console.log(lang, await page.locator(".contact-info .info-card").allInnerTexts());
    await page.close();
  }
} finally { await browser.close(); }
