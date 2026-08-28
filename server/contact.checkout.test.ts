import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const contact = readFileSync(resolve(projectRoot, "client/contact.html"), "utf8");
const checkout = readFileSync(resolve(projectRoot, "client/checkout.html"), "utf8");
const styles = readFileSync(resolve(projectRoot, "client/assets/css/styles.css"), "utf8");

describe("Contact and checkout mobile feedback guardrails", () => {
  it("keeps Contact validation, loading, retry, and Telegram status behavior", () => {
    expect(contact).toContain("form.checkValidity()");
    expect(contact).toContain("sendContactMessage(data)");
    expect(contact).toContain("contact_sending");
    expect(contact).toContain("contact_send_error");
    expect(contact).toContain("aria-busy");
  });

  it("keeps Checkout persistence, Telegram delivery, duplicate-click protection, and loading behavior", () => {
    expect(checkout).toContain('type="button"');
    expect(checkout).toContain("/api/orders");
    expect(checkout).toContain("sendTelegramNotification");
    expect(checkout).toContain("checkoutSubmitting");
    expect(checkout).toContain("order_telegram_error");
    expect(checkout).toContain("checkoutStatus");
    expect(checkout).not.toContain("alert(error");
    expect(checkout).toContain("aria-busy");
  });

  it("keeps tactile button feedback and reduced-motion support", () => {
    expect(styles).toContain("button:not(:disabled):active");
    expect(styles).toContain("transform: scale(0.97)");
    expect(styles).toContain(".button-spinner");
    expect(styles).toContain("prefers-reduced-motion: reduce");
  });
});
