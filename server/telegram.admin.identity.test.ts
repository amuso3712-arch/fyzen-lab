import { describe, expect, it } from "vitest";

describe("Telegram admin identity secret", () => {
  it("contains the verified human admin ID and not the bot ID", () => {
    const configured = (process.env.TELEGRAM_ADMIN_IDS || "").split(",").map(value => value.trim()).filter(Boolean);
    expect(configured).toContain("7812685703");
    expect(configured).not.toContain("8548524660");
  });
});
