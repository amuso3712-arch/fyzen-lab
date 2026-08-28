import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 844 } });
await page.addInitScript(() => localStorage.setItem("fyzen_lang", "en"));
await page.goto("https://3000-ii17i7r3w8hhw969gazsx-24be962.us4.manus.computer/cart.html?cart-debug=1", { waitUntil: "networkidle" });
await page.waitForTimeout(300);
console.log(await page.locator("#cartContent").innerText());
console.log(await page.locator("#cartContent a").evaluateAll(links => links.map(link => ({ text: link.textContent, visible: getComputedStyle(link).display !== "none", href: link.getAttribute("href") }))));
await browser.close();
