import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Telegram admin panel shortcut URL", () => {
  it("uses an absolute admin.html URL", () => {
    const value = process.env.TELEGRAM_ADMIN_PANEL_URL || "";
    expect(value).toMatch(/^https:\/\/.+\/admin\.html$/);
  });

  it("defines Telegram Mini App and web fallback buttons", () => {
    const source = readFileSync(join(process.cwd(), "server/telegramAdmin.ts"), "utf8");
    expect(source).toContain("Mini Appni ochish");
    expect(source).toContain("Web adminni ochish");
    expect(source).toContain("url: ADMIN_PANEL_URL");
  });
});
