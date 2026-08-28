import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const clientRoot = path.join(projectRoot, "client");
const assetsRoot = path.join(clientRoot, "assets");

function readClientFile(fileName: string) {
  return fs.readFileSync(path.join(clientRoot, fileName), "utf8");
}

describe("published legacy site production contract", () => {
  it("keeps every public page and runtime asset in the client source tree", () => {
    for (const page of ["index.html", "catalog.html", "contact.html", "brands.html", "products.html"]) {
      expect(fs.existsSync(path.join(clientRoot, page)), page).toBe(true);
    }

    for (const asset of [
      "js/lang.js",
      "js/main.js",
      "js/verified-brands.js",
      "js/brand-logos.js",
    ]) {
      expect(fs.existsSync(path.join(assetsRoot, asset)), asset).toBe(true);
    }
  });

  it("references cache-busted i18n/runtime assets and valid page links", () => {
    for (const page of ["index.html", "catalog.html", "contact.html", "brands.html", "products.html"]) {
      const html = readClientFile(page);
      expect(html).toMatch(/assets\/js\/lang\.js\?v=27\.0/);
      expect(html).toMatch(/assets\/js\/main\.js\?v=17\.0/);
      expect(html).toContain('href="catalog.html?v=12"');
      expect(html).toContain('href="contact.html?v=12"');
    }
  });

  it("keeps the language controls and localized document title contract", () => {
    const home = readClientFile("index.html");
    const lang = fs.readFileSync(path.join(assetsRoot, "js/lang.js"), "utf8");

    expect(home).toContain('data-lang="uz"');
    expect(home).toContain('data-lang="ru"');
    expect(home).toContain('data-lang="en"');
    expect(lang).toContain("window.changeLanguage = changeLanguage");
    expect(lang).toContain("if (el.tagName === 'TITLE') document.title = translatedTitle");
  });

  it("keeps the complete verified 29-brand metadata source", () => {
    const verifiedBrands = fs.readFileSync(path.join(assetsRoot, "js/verified-brands.js"), "utf8");
    expect(verifiedBrands).toContain("window.FYZEN_VERIFIED_BRANDS");
    expect(verifiedBrands.match(/^[ \t]*\"[^\"]+\": \{/gm)?.length).toBe(29);
  });

  it("copies legacy assets into the Vite production output", () => {
    const viteConfig = fs.readFileSync(path.join(projectRoot, "vite.config.ts"), "utf8");
    expect(viteConfig).toContain("function vitePluginLegacyAssets");
    expect(viteConfig).toContain("fs.cpSync(sourceDir, targetDir");
  });
});
