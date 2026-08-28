import { describe, expect, it } from "vitest";
import { isTelegramAdmin } from "./telegramAdmin";

describe("extra Telegram admin configuration", () => {
  it("accepts the configured additional administrator ID", () => {
    expect(process.env.TELEGRAM_EXTRA_ADMIN_IDS).toContain("1138692937");
    expect(isTelegramAdmin(1138692937)).toBe(true);
  });
});
