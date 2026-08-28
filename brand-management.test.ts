import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const miniApp = fs.readFileSync(path.join(root, "server/telegramMiniApp.ts"), "utf8");
const miniAppHtml = fs.readFileSync(path.join(root, "client/telegram-admin.html"), "utf8");
const brandsHtml = fs.readFileSync(path.join(root, "client/brands.html"), "utf8");
const productsHtml = fs.readFileSync(path.join(root, "client/products.html"), "utf8");
const schema = fs.readFileSync(path.join(root, "drizzle/schema.ts"), "utf8");

describe("Telegram Mini App brand management contract", () => {
  it("defines a persisted draft/approved brand model", () => {
    expect(schema).toContain('mysqlTable("brand_submissions"');
    expect(schema).toContain('mysqlEnum("status", ["draft", "approved", "rejected"])');
    for (const field of ["logoUrl", "websiteUrl", "specialtyEn", "specialtyUz", "specialtyRu", "descriptionEn", "descriptionUz", "descriptionRu"]) {
      expect(schema).toContain(`${field}:`);
    }
  });

  it("protects brand list/create/approve routes with Telegram admin auth", () => {
    expect(miniApp).toContain('app.get("/api/telegram/miniapp/brands", listBrands)');
    expect(miniApp).toContain('app.post("/api/telegram/miniapp/brands", createBrand)');
    expect(miniApp).toContain('app.post("/api/telegram/miniapp/brands/:slug/approve", approveBrand)');
    expect(miniApp).toContain('if (!await auth(req, res)) return;');
    expect(miniApp).toContain("Bu brand allaqachon mavjud.");
    expect(miniApp).toContain("safeUrl");
  });

  it("exposes approved brands publicly and wires them into both public pages", () => {
    expect(miniApp).toContain('app.get("/api/brands/published", listPublishedBrands)');
    expect(brandsHtml).toContain("/api/brands/published");
    expect(brandsHtml).toContain("brandsList.push({ name: brand.name })");
    expect(productsHtml).toContain("/api/brands/published");
    expect(productsHtml).toContain("publishedBrandNames");
  });

  it("provides Mini App fields and draft approval controls", () => {
    for (const id of ["brandName", "brandLogoUrl", "brandWebsiteUrl", "brandSpecialtyUz", "brandSpecialtyRu", "brandSpecialtyEn", "brandDescriptionUz", "brandDescriptionRu", "brandDescriptionEn"]) {
      expect(miniAppHtml).toContain(`id=\"${id}\"`);
    }
    expect(miniAppHtml).toContain('data-tab="add-brand"');
    expect(miniAppHtml).toContain("data-approve-brand");
    expect(miniAppHtml).toContain("/api/telegram/miniapp/brands");
  });
});
