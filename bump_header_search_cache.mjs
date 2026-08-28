import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const root = join(process.cwd(), "client");
const pages = ["index.html","about.html","brands.html","blog.html","cart.html","catalog.html","checkout.html","contact.html","product-details.html","products.html","wishlist.html","admin.html"];
for (const page of pages) {
  const path = join(root, page);
  let html = readFileSync(path, "utf8");
  html = html.replace(/assets\/js\/main\.js\?v=[^"']+/g, "assets/js/main.js?v=15.0");
  html = html.replace(/assets\/css\/styles\.css\?v=[^"']+/g, "assets/css/styles.css?v=39.0");
  writeFileSync(path, html);
}
