import { chromium } from "playwright";
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:375,height:812}});
await page.addInitScript(() => localStorage.setItem("fyzen_lang", "ru"));
await page.goto("https://3000-ii17i7r3w8hhw969gazsx-24be962.us4.manus.computer/contact.html?compact-audit=375&lang=ru", {waitUntil:"domcontentloaded"});
await page.waitForTimeout(500);
console.log(await page.locator(".contact-info .info-card").allInnerTexts());
await browser.close();
