import { chromium } from "playwright";
import assert from "node:assert/strict";

const base = process.env.FYZEN_PREVIEW_URL || "https://3000-ii17i7r3w8hhw969gazsx-24be962.us4.manus.computer";
const languages = ["ru", "uz", "en"];
const widths = [375, 390];
const pages = [
  ["home", "/index.html"],
  ["products", "/products.html"],
  ["catalog", "/catalog.html"],
  ["details", "/product-details.html?id=11"],
  ["brands", "/brands.html"],
  ["about", "/about.html"],
  ["news", "/blog.html"],
  ["contact", "/contact.html"],
  ["cart", "/cart.html"],
  ["checkout", "/checkout.html"],
  ["wishlist", "/wishlist.html"],
];
const browser = await chromium.launch({ headless: true });
const failures = [];
const passed = [];
try {
  for (const width of widths) {
    for (const language of languages) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
      await context.addInitScript(lang => localStorage.setItem("fyzen_lang", lang), language);
      const page = await context.newPage();
      for (const [name, path] of pages) {
        const separator = path.includes("?") ? "&" : "?";
        await page.goto(`${base}${path}${separator}mobile-deep-audit=${language}-${width}`, { waitUntil: "networkidle", timeout: 20000 });
        await page.waitForTimeout(220);
        const result = await page.evaluate(() => {
          const visible = el => {
            if (!el) return false;
            const style = getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
          };
          const visibleElements = selector => [...document.querySelectorAll(selector)].filter(visible);
          const blankI18n = visibleElements("[data-i18n]").filter(el => {
            const tag = el.tagName.toLowerCase();
            if (tag === "input" || tag === "textarea") return !(el.getAttribute("placeholder") || "").trim();
            return !el.textContent.trim();
          }).length;
          const viewport = innerWidth;
          const inViewport = el => {
            const rect = el.getBoundingClientRect();
            return rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < viewport;
          };
          const outOfBounds = visibleElements("a,button,input,select,textarea").filter(el => inViewport(el)).filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.left < -1 || rect.right > viewport + 1;
          }).slice(0, 8).map(el => ({ tag: el.tagName, text: (el.textContent || el.getAttribute("aria-label") || el.getAttribute("placeholder") || "").trim().slice(0, 50), left: Math.round(el.getBoundingClientRect().left), right: Math.round(el.getBoundingClientRect().right) }));
          const brokenImages = visibleElements("img").filter(img => img.complete && img.naturalWidth === 0).map(img => img.getAttribute("src"));
          const titles = visibleElements(".page-title, .company-text h1, .hero-content h1");
          const titleBounds = titles.slice(0, 2).map(el => ({ text: el.textContent.trim().slice(0, 60), left: Math.round(el.getBoundingClientRect().left), right: Math.round(el.getBoundingClientRect().right) }));
          const nav = document.querySelector(".nav-inner")?.getBoundingClientRect();
          return {
            lang: document.documentElement.lang,
            scrollWidth: document.documentElement.scrollWidth,
            viewport,
            bodyTextLength: document.body.innerText.trim().length,
            blankI18n,
            outOfBounds,
            brokenImages,
            titleBounds,
            navRight: nav ? Math.round(nav.right) : viewport,
          };
        });
        const issues = [];
        if (result.lang !== language) issues.push(`lang=${result.lang}`);
        if (result.scrollWidth > width + 1) issues.push(`overflow=${result.scrollWidth - width}`);
        if (result.bodyTextLength < 40) issues.push(`short-body=${result.bodyTextLength}`);
        if (result.blankI18n) issues.push(`blank-i18n=${result.blankI18n}`);
        if (result.brokenImages.length) issues.push(`broken-images=${result.brokenImages.join(",")}`);
        if (result.outOfBounds.length) issues.push(`out-of-bounds=${JSON.stringify(result.outOfBounds)}`);
        if (result.navRight > width + 1) issues.push(`nav-right=${result.navRight}`);
        if (result.titleBounds.some(title => title.left < -1 || title.right > width + 1)) issues.push(`title-out-of-bounds=${JSON.stringify(result.titleBounds)}`);
        const record = `${language}/${width}/${name}`;
        if (issues.length) failures.push({ record, issues });
        else passed.push(record);
      }
      await context.close();
    }
  }
  console.log(JSON.stringify({ passed: passed.length, total: widths.length * languages.length * pages.length, failures }, null, 2));
  assert.equal(failures.length, 0, `${failures.length} mobile audit records failed`);
} finally {
  await browser.close();
}
