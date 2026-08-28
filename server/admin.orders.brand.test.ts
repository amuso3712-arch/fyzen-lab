import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const admin = readFileSync(resolve(root, "client/admin.html"), "utf8");
const checkout = readFileSync(resolve(root, "client/checkout.html"), "utf8");
const products = readFileSync(resolve(root, "client/products.html"), "utf8");
const orders = readFileSync(resolve(root, "server/orders.ts"), "utf8");
const oauth = readFileSync(resolve(root, "server/_core/oauth.ts"), "utf8");

describe("Admin orders, checkout confirmation, and brand filter guardrails", () => {
  it("does not keep the legacy hardcoded admin password and exposes OAuth entry", () => {
    expect(admin).not.toContain("ADMIN_PASSWORD");
    expect(admin).not.toContain("fyzen2025admin");
    expect(admin).toContain("/api/oauth/start");
    expect(admin).toContain("/api/admin/orders");
    expect(orders).toContain("user.role !== \"admin\"");
    expect(oauth).toContain("oauth_return_to");
  });

  it("supports protected order listing and explicit status updates", () => {
    expect(orders).toContain("app.get(\"/api/admin/orders\"");
    expect(orders).toContain("app.patch(\"/api/admin/orders/:requestId/status\"");
    expect(orders).toContain('"new", "processing", "completed", "cancelled"');
    expect(admin).toContain("updateOrderStatus(this)");
    expect(admin).toContain("viewOrderDetails");
  });

  it("renders an animated order confirmation modal with customer and item details", () => {
    expect(checkout).toContain("confirmationDetails");
    expect(checkout).toContain("renderConfirmationDetails");
    expect(checkout).toContain("confirmation-pop");
    expect(checkout).toContain("prefers-reduced-motion");
  });

  it("provides a multilingual brand filter synchronized with product rendering", () => {
    expect(products).toContain('id="brandFilter"');
    expect(products).toContain("populateBrandFilter");
    expect(products).toContain("setBrandFilter");
    expect(products).toContain("matchesBrand");
    expect(products).toContain('data-i18n="brand_filter"');
  });
});
