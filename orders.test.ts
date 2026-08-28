import { describe, expect, it } from "vitest";
import { validateOrder } from "./orders";
import { buildOrderMessage } from "./telegram";

describe("checkout order validation", () => {
  it("accepts a complete order and normalizes safe item data", () => {
    const result = validateOrder({
      id: 123456,
      customerName: "Ali Test",
      customerPhone: "+998 90 000 00 00",
      organization: "Fyzen Lab",
      notes: "Please call before delivery",
      items: [{ name: "Analyzer <A>", quantity: 2 }],
    });
    expect(result).toMatchObject({
      requestId: "123456",
      customerName: "Ali Test",
      customerPhone: "+998 90 000 00 00",
      items: [{ name: "Analyzer <A>", quantity: 2 }],
    });
  });

  it("rejects incomplete orders and empty carts", () => {
    expect(validateOrder({ customerName: "A", customerPhone: "12", items: [] })).toBeNull();
    expect(validateOrder({ customerName: "Ali", customerPhone: "+998900000000", items: [{ name: "Item", quantity: 1 }] })).toBeNull();
  });
});

describe("checkout Telegram notification", () => {
  it("escapes item markup before sending the order message", () => {
    const message = buildOrderMessage({
      customerName: "Ali <Test>",
      customerPhone: "+998 90 000 00 00",
      items: [{ name: "Analyzer <A>", quantity: 2 }],
    });
    expect(message).toContain("Ali &lt;Test&gt;");
    expect(message).toContain("Analyzer &lt;A&gt;");
    expect(message).not.toContain("<Test>");
  });
});
