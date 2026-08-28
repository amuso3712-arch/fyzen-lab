import { describe, expect, it } from "vitest";

describe("Telegram secret configuration", () => {
  it("accepts a valid bot token through Telegram getMe without exposing it", async () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    expect(token, "TELEGRAM_BOT_TOKEN is required for this validation").toBeTruthy();

    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
      signal: AbortSignal.timeout(10_000),
    });
    const payload = (await response.json()) as { ok?: boolean };

    expect(response.ok).toBe(true);
    expect(payload.ok).toBe(true);
  }, 15_000);

  it("accepts a reachable destination chat through Telegram getChat", async () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    expect(token, "TELEGRAM_BOT_TOKEN is required for this validation").toBeTruthy();
    expect(chatId, "TELEGRAM_CHAT_ID is required for this validation").toBeTruthy();

    const response = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${encodeURIComponent(chatId!)}`, {
      signal: AbortSignal.timeout(10_000),
    });
    const payload = (await response.json()) as { ok?: boolean };

    expect(response.ok).toBe(true);
    expect(payload.ok).toBe(true);
  }, 15_000);
});
