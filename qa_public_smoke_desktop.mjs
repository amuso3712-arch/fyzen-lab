import { chromium } from "playwright";
const pages = ["index.html","products.html","catalog.html","product-details.html","brands.html","about.html","blog.html","contact.html","cart.html","checkout.html","wishlist.html","admin.html","telegram-admin.html"];
const browser = await chromium.launch({ headless: true });
const output = [];
for (const path of pages) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on("pageerror", e => errors.push(`pageerror:${e.message}`));
  page.on("console", m => { if (m.type() === "error") errors.push(`console:${m.text()}`); });
  try {
    const response = await page.goto(`http://127.0.0.1:3000/${path}`, { waitUntil: "networkidle", timeout: 15000 });
    const state = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > window.innerWidth + 1, width: document.documentElement.scrollWidth, viewport: window.innerWidth, desktopSearch: Boolean(document.querySelector("#desktopProductSearch")) }));
    output.push({ path, status: response?.status(), ...state, errors });
  } catch (e) { output.push({ path, status: "failed", errors: [...errors, e.message] }); }
  await page.close();
}
console.log(JSON.stringify(output, null, 2));
await browser.close();
