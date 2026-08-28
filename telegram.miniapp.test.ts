import { createHmac } from "node:crypto";
import { describe, expect, it, beforeEach } from "vitest";

function sign(token: string, values: Record<string, string>) {
  const payload = new URLSearchParams(values);
  const dataCheckString = Array.from(payload.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join("\n");
  const secret = createHmac("sha256", token).update("WebAppData").digest();
  payload.set("hash", createHmac("sha256", secret).update(dataCheckString).digest("hex"));
  return payload.toString();
}

describe("Telegram Mini App authentication", () => {
  beforeEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = "mini-app-test-token";
    process.env.TELEGRAM_ADMIN_IDS = "7812685703";
  });

  it("accepts valid signed initData for the verified admin", async () => {
    const { validateTelegramWebAppInitData } = await import("./telegramMiniApp");
    const data = sign("mini-app-test-token", { auth_date: "1700000000", user: JSON.stringify({ id: 7812685703, first_name: "Admin" }) });
    expect(validateTelegramWebAppInitData(data, 1700000000)?.id).toBe(7812685703);
  });

  it("rejects tampered and expired initData", async () => {
    const { validateTelegramWebAppInitData } = await import("./telegramMiniApp");
    const data = sign("mini-app-test-token", { auth_date: "1700000000", user: JSON.stringify({ id: 7812685703 }) });
    expect(validateTelegramWebAppInitData(data.replace("7812685703", "123"), 1700000000)).toBeNull();
    expect(validateTelegramWebAppInitData(data, 1700000000 + 86401)).toBeNull();
  });
});
