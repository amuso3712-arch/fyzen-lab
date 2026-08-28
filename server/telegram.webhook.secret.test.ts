import { describe, expect, it } from "vitest";

describe("Telegram webhook secret endpoint", () => {
  it("accepts the configured secret and rejects a wrong one", async () => {
    const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3000";
    const valid = await fetch(`${baseUrl}/api/telegram/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Bot-Api-Secret-Token": process.env.TELEGRAM_WEBHOOK_SECRET || "" },
      body: JSON.stringify({}),
    });
    expect(valid.status).not.toBe(401);

    const invalid = await fetch(`${baseUrl}/api/telegram/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Bot-Api-Secret-Token": "wrong-secret" },
      body: JSON.stringify({}),
    });
    expect(invalid.status).toBe(401);
  }, 15_000);
});
