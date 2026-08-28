import { chromium } from "playwright";
const base = "https://3000-idoosqu28lnue7qss1a3m-e8b50e28.us5.manus.computer";
const browser = await chromium.launch({ headless: true });
for (const lang of ["ru", "uz", "en"]) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript((value) => localStorage.setItem("fyzen_lang", value), lang);
  const page = await context.newPage();
  await page.goto(`${base}/about.html?language-capture=${lang}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(350);
  const result = await page.evaluate(() => {
    const title = document.querySelector(".company-text h1");
    const desc = document.querySelector(".company-text > p");
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, right: r.right, width: r.width, height: r.height };
    };
    return { lang: document.documentElement.lang, title: title?.innerText, titleRect: title && rect(title), descLength: desc?.innerText.length, scrollWidth: document.documentElement.scrollWidth };
  });
  console.log(JSON.stringify(result));
  await page.screenshot({ path: `/home/ubuntu/about-${lang}-mobile.png`, fullPage: false });
  await context.close();
}
await browser.close();
