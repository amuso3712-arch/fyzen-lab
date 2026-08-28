import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const miniApp = fs.readFileSync(path.join(root, "server/telegramMiniApp.ts"), "utf8");
const adminPage = fs.readFileSync(path.join(root, "client/telegram-admin.html"), "utf8");
const blogPage = fs.readFileSync(path.join(root, "client/blog.html"), "utf8");
const schema = fs.readFileSync(path.join(root, "drizzle/schema.ts"), "utf8");
const telegramAdmin = fs.readFileSync(path.join(root, "server/telegramAdmin.ts"), "utf8");

describe("unified Telegram content administration", () => {
  it("keeps the extra administrator separate from the existing admin list", () => {
    expect(telegramAdmin).toContain("TELEGRAM_ADMIN_IDS");
    expect(telegramAdmin).toContain("TELEGRAM_EXTRA_ADMIN_IDS");
    expect(telegramAdmin).toContain("isTelegramAdmin");
  });

  it("has a multilingual persisted news model", () => {
    expect(schema).toContain('mysqlTable("news_submissions"');
    for (const field of ["titleEn", "titleUz", "titleRu", "excerptEn", "excerptUz", "excerptRu", "contentEn", "contentUz", "contentRu", "imageUrl", "publishedAt"]) {
      expect(schema).toContain(`${field}:`);
    }
  });

  it("protects content mutations and exposes all required routes", () => {
    for (const route of [
      'app.patch("/api/telegram/miniapp/products/:productId", updateProduct)',
      'app.delete("/api/telegram/miniapp/products/:productId", deleteProduct)',
      'app.patch("/api/telegram/miniapp/brands/:slug", updateBrand)',
      'app.delete("/api/telegram/miniapp/brands/:slug", deleteBrand)',
      'app.post("/api/telegram/miniapp/news", createNews)',
      'app.patch("/api/telegram/miniapp/news/:slug", updateNews)',
      'app.post("/api/telegram/miniapp/news/:slug/approve", approveNews)',
      'app.delete("/api/telegram/miniapp/news/:slug", deleteNews)',
      'app.get("/api/news/published", listPublishedNews)',
    ]) expect(miniApp).toContain(route);
    expect(miniApp.match(/if \(!await auth\(req, res\)\) return;/g)?.length).toBeGreaterThanOrEqual(10);
  });

  it("renders approved news publicly and provides Mini App management controls", () => {
    expect(blogPage).toContain("/api/news/published");
    for (const token of ["data-tab=\"news\"", "data-tab=\"add-news\"", "data-delete-product", "data-delete-brand", "data-delete-news", "data-edit-brand", "data-edit-news"]) {
      expect(adminPage).toContain(token);
    }
    expect(adminPage).toContain("/api/telegram/miniapp/news");
    expect(adminPage).toContain("Yangilik draft sifatida saqlandi");
  });
});
