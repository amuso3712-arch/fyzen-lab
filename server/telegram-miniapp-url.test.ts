import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Telegram Mini App URL secret", () => {
  it("uses an absolute versioned telegram-admin.html URL", () => {
    const value = process.env.TELEGRAM_MINI_APP_URL || "";
    expect(value).toMatch(/^https:\/\/.+\/telegram-admin\.html(?:\?[^\s]+)?$/);
  });

  it("includes secure auth and product editing controls", () => {
    const source = readFileSync(join(process.cwd(), "server/telegramAdmin.ts"), "utf8");
    const miniApp = readFileSync(join(process.cwd(), "client/telegram-admin.html"), "utf8");
    expect(source).toContain("MINI_APP_URL");
    expect(source).toContain("web_app");
    expect(miniApp).toContain("/api/telegram/miniapp/auth");
    expect(miniApp).toContain("data-edit");
  });
});
