import { describe, expect, it } from "vitest";
import { isTelegramWebhookSecretValid } from "./telegram";

describe("Telegram webhook secret", () => {
  it("accepts the configured secret header and rejects missing or wrong values", () => {
    const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    expect(configuredSecret).toBeTruthy();
    expect(isTelegramWebhookSecretValid(configuredSecret)).toBe(true);
    expect(isTelegramWebhookSecretValid(undefined)).toBe(false);
    expect(isTelegramWebhookSecretValid(`${configuredSecret}-wrong`)).toBe(false);
  });
});
