import { describe, expect, it } from "vitest";
import { buildContactMessage } from "./telegram";

describe("Telegram contact messages", () => {
  it("formats contact details and escapes Telegram HTML", () => {
    const message = buildContactMessage({
      name: "Ali <Test>",
      email: "ali@example.com",
      message: "Please help & advise",
    });

    expect(message).toContain("✉️ <b>Yangi xabar — Contact formasidan</b>");
    expect(message).toContain("Ali &lt;Test&gt;");
    expect(message).toContain("Please help &amp; advise");
    expect(message).not.toContain("<Test>");
  });

  it("uses safe fallbacks for missing optional values", () => {
    const message = buildContactMessage({});

    expect(message).toContain("Ko'rsatilmagan");
    expect(message).toContain("Email");
    expect(message).toContain("Xabar");
  });
});
