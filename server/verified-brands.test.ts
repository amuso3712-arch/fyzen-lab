import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const expected = [
  "LaMotte", "TES", "BINDER", "Shimadzu", "Fisatom", "HORIBA", "YMC PIEZOTRONICS", "Agilent", "BIOBASE", "GTJ", "YGYB", "HAIDA EQUIPMENT", "TBT SCIETECH", "SCITEK", "HEAL FORCE", "JOANLAB", "trinamix (BASF)", "TOKYO KEIKI", "Kanghua", "Hanwei", "HOBO", "MELING BIOMEDICAL", "Pruftechnik", "Konica Minolta", "FPI", "testo", "FUJI Electric", "Shandong NKT", "JIBI Med."
];

describe("verified brand directory", () => {
  it("contains exactly the owner-provided 29 brands", () => {
    const source = readFileSync(join(process.cwd(), "client/assets/js/verified-brands.js"), "utf8");
    const values = [...source.matchAll(/^\s*"([^"]+)":\s*\{/gm)].map(match => match[1]);
    expect(values).toEqual(expected);
  });

  it("adds accessible premium hover treatments to selected card surfaces", () => {
    const brands = readFileSync(join(process.cwd(), "client/brands.html"), "utf8");
    const verified = readFileSync(join(process.cwd(), "client/assets/js/verified-brands.js"), "utf8");
    const home = readFileSync(join(process.cwd(), "client/index.html"), "utf8");
    const catalog = readFileSync(join(process.cwd(), "client/catalog.html"), "utf8");
    expect(brands).toContain(".brand-item:focus-visible");
    expect(brands).toContain(".brand-hover-action");
    expect(brands).toContain("prefers-reduced-motion: reduce");
    expect(brands).toContain("role=\"button\"");
    expect(brands).toContain("aria-haspopup=\"dialog\"");
    expect(brands).toContain("brand-details-modal");
    expect(brands).toContain("aria-describedby=\"brandDetailsDescription\"");
    expect(brands).toContain("openBrandDetails");
    expect(brands).toContain("data-brand-modal-close");
    expect(brands).toContain("event.key === 'Escape'");
    expect(brands).toContain("brandModalTrigger?.focus()");
    expect(brands).toContain("max-height: min(720px, calc(100vh - 36px))");
    expect(brands).toContain("FYZEN_BRAND_LOGO_URL");
    expect(verified).toContain("favicon.ico");
    expect(verified).not.toContain("logo.clearbit.com");
    expect(brands).not.toContain("google.com/s2/favicons");
    expect(verified).toContain("/manus-storage/jibi-med_531ea85a.png");
    expect(verified).toContain("/manus-storage/shandong-nkt_d381b4d2.webp");
    expect(verified).toContain("/manus-storage/fuji-electric_77d5fbaa.webp");
    expect(verified).toContain("/manus-storage/binder_b76d36a0.png");
    expect(verified).toContain("/manus-storage/pruftechnik_c296e7b1.png");
    expect(verified).toContain("/manus-storage/ygyb_681d5e6d.png");
    expect(verified).toContain("/manus-storage/gtj_81cc4aba.png");
    expect(verified).toContain("/manus-storage/scitek_665b073a.png");
    expect(verified).toContain("/manus-storage/heal-force_f1a0570c.png");
    expect(verified).not.toContain("SCITECH");
    expect(home).toContain(".cat-card-p:hover");
    expect(catalog).toContain(".categories-grid-p .cat-card-p:hover");
  });

  it("uses the directory on the Brands and Products pages", () => {
    const brands = readFileSync(join(process.cwd(), "client/brands.html"), "utf8");
    const products = readFileSync(join(process.cwd(), "client/products.html"), "utf8");
    expect(brands).toContain("verified-brands.js");
    expect(brands).toContain("window.FYZEN_VERIFIED_BRANDS");
    expect(products).toContain("verified-brands.js");
    expect(products).toContain("window.FYZEN_VERIFIED_BRANDS");
  });
});
