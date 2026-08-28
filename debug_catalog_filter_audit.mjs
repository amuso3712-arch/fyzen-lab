import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 844 } });
page.on("console", message => console.log("console", message.type(), message.text()));
page.on("pageerror", error => console.log("pageerror", error.message));
await page.goto("https://3000-ii17i7r3w8hhw969gazsx-24be962.us4.manus.computer/catalog.html?category-filter-debug=375", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
console.log(await page.evaluate(() => ({ ready: document.readyState, trigger: Boolean(document.querySelector("#catalogMobileFilterTrigger")), options: Boolean(document.querySelector("#catalogMobileFilterOptions")), wrapper: Boolean(document.querySelector(".catalog-mobile-filter")), grid: Boolean(document.querySelector(".categories-grid-p")), bodyClass: document.body.className })));
await browser.close();
