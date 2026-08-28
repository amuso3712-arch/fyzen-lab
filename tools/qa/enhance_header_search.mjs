import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const root = join(process.cwd(), "client");
const pages = ["index.html","about.html","brands.html","blog.html","cart.html","catalog.html","checkout.html","contact.html","product-details.html","products.html","wishlist.html"];
for (const page of pages) {
  const path = join(root, page);
  let html = readFileSync(path, "utf8");
  if (html.includes("desktop-product-search-clear")) continue;
  const old = `                    <input type="search" data-i18n="search_placeholder" placeholder="Search products..." autocomplete="off" aria-label="Search products">\n                    <button type="submit" aria-label="Search products">↵</button>`;
  const next = `                    <input type="search" data-i18n="search_placeholder" placeholder="Search products..." autocomplete="off" aria-label="Search products">\n                    <button type="button" class="desktop-product-search-clear" data-search-clear aria-label="Clear search" hidden>×</button>\n                    <button type="submit" class="desktop-product-search-submit" aria-label="Search products"><span class="search-submit-icon">↵</span><span class="search-submit-spinner" aria-hidden="true"></span></button>\n                    <div class="desktop-search-suggestions" data-search-suggestions hidden role="listbox" aria-label="Popular searches">\n                        <div class="desktop-search-suggestions-label" data-i18n="popular_searches">Popular searches</div>\n                        <button type="button" data-search-suggestion="Shimadzu">Shimadzu</button>\n                        <button type="button" data-search-suggestion="Agilent">Agilent</button>\n                        <button type="button" data-search-suggestion="BINDER">BINDER</button>\n                        <button type="button" data-search-suggestion="HORIBA">HORIBA</button>\n                    </div>`;
  if (!html.includes(old)) throw new Error(`Search input markup not found in ${page}`);
  writeFileSync(path, html.replace(old, next));
}
