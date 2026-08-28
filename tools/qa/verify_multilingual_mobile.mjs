import { chromium } from "playwright";

const base = "https://3000-ii17i7r3w8hhw969gazsx-24be9626.us4.manus.computer";
const languages = ["ru", "uz", "en"];
const widths = [375, 390];
const pages = [
  ["home", "/index.html"],
  ["about", "/about.html"],
  ["contact", "/contact.html"],
  ["brands", "/brands.html"],
  ["news", "/blog.html"],
  ["catalog", "/catalog.html"],
  ["products", "/products.html"],
  ["cart", "/cart.html"],
  ["checkout", "/checkout.html"],
  ["wishlist", "/wishlist.html"],
  ["details", "/product-details.html?id=1"],
];

const browser = await chromium.launch({ headless: true });
const failures = [];
const passed = [];

for (const language of languages) {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 844 } });
    await context.addInitScript((lang) => localStorage.setItem("fyzen_lang", lang), language);
    const page = await context.newPage();
    for (const [name, path] of pages) {
      const separator = path.includes("?") ? "&" : "?";
      await page.goto(`${base}${path}${separator}mobile-lang=${language}-${width}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(180);
      const result = await page.evaluate(() => {
        const visible = (el) => {
          const style = getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
        };
        const title = document.querySelector(".page-title, .company-text h1, .hero-content h1");
        const allI18n = [...document.querySelectorAll("[data-i18n]")];
        return {
          lang: document.documentElement.lang,
          scrollWidth: document.documentElement.scrollWidth,
          viewport: innerWidth,
          bodyTextLength: document.body.innerText.trim().length,
          blankI18n: allI18n.filter((el) => {
            if (!visible(el)) return false;
            const tag = el.tagName.toLowerCase();
            if (tag === "input" || tag === "textarea") return !(el.getAttribute("placeholder") || "").trim();
            return !el.textContent.trim();
          }).length,
          title: title ? { x: title.getBoundingClientRect().x, right: title.getBoundingClientRect().right, width: title.getBoundingClientRect().width } : null,
        };
      });
      const issues = [];
      if (result.lang !== language) issues.push(`lang=${result.lang}`);
      if (result.scrollWidth > width + 1) issues.push(`overflow=${result.scrollWidth}`);
      if (result.bodyTextLength < 40) issues.push(`short-body=${result.bodyTextLength}`);
      if (result.blankI18n > 0) issues.push(`blank-i18n=${result.blankI18n}`);
      if (result.title && (result.title.x < -1 || result.title.right > width + 1)) issues.push(`title-outside=${JSON.stringify(result.title)}`);
      const record = `${language}/${width}/${name}`;
      if (issues.length) failures.push({ record, issues });
      else passed.push(record);
    }
    await context.close();
  }
}

console.log(JSON.stringify({ passed: passed.length, total: languages.length * widths.length * pages.length, failures }, null, 2));
await browser.close();
if (failures.length) process.exit(1);
