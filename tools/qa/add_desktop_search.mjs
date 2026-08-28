import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const root = join(process.cwd(), "client");
const pages = ["index.html","about.html","brands.html","blog.html","cart.html","catalog.html","checkout.html","contact.html","product-details.html","products.html","wishlist.html"];
const search = `                <form class="desktop-product-search" id="desktopProductSearch" role="search" onsubmit="submitDesktopProductSearch(event)">
                    <svg class="desktop-product-search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>
                    <input type="search" data-i18n="search_placeholder" placeholder="Search products..." autocomplete="off" aria-label="Search products">
                    <button type="submit" aria-label="Search products">↵</button>
                </form>\n`;
for (const page of pages) {
  const path = join(root, page);
  let html = readFileSync(path, "utf8");
  if (!html.includes('class="desktop-product-search"')) {
    const marker = '                <div class="nav-lang-switcher">';
    const emptyActions = '            <div class="nav-actions"></div>';
    if (html.includes(marker)) {
      html = html.replace(marker, search + marker);
    } else if (html.includes(emptyActions)) {
      html = html.replace(emptyActions, `            <div class="nav-actions">\n${search}            </div>`);
    } else {
      throw new Error(`Missing nav actions marker in ${page}`);
    }
    writeFileSync(path, html);
  }
}
