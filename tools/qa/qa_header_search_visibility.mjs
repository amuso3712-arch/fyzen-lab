import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto("http://127.0.0.1:3000/index.html", { waitUntil: "networkidle" });
console.log(await page.evaluate(() => { const el = document.querySelector("#desktopProductSearch"); const nav = document.querySelector(".nav-actions"); return { count: document.querySelectorAll("#desktopProductSearch").length, display: el && getComputedStyle(el).display, rect: el?.getBoundingClientRect().toJSON(), navHtml: nav?.innerHTML.slice(0,300), navRect: nav?.getBoundingClientRect().toJSON() }; }));
await browser.close();
