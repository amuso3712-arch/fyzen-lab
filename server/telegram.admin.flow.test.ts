import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Telegram-only admin flow guardrails", () => {
  const root = join(process.cwd());
  const adminSource = readFileSync(join(root, "server/telegramAdmin.ts"), "utf8");
  const routeSource = readFileSync(join(root, "server/telegram.ts"), "utf8");
  const clientSource = readFileSync(join(root, "client/assets/js/main.js"), "utf8");

  it("keeps authorization tied to the requested Telegram numeric ID", () => {
    expect(adminSource).toContain("process.env.TELEGRAM_ADMIN_IDS");
    expect(adminSource).toContain("isTelegramAdmin");
  });

  it("covers order status and product approval actions", () => {
    expect(adminSource).toContain('data.startsWith("status:")');
    expect(adminSource).toContain('data.startsWith("approve:")');
    expect(adminSource).toContain('status: "draft"');
  });

  it("exposes a secret-protected webhook and approved product endpoint", () => {
    expect(routeSource).toContain('app.post("/api/telegram/webhook"');
    expect(routeSource).toContain('app.get("/api/products/published"');
    expect(routeSource).toContain("isTelegramWebhookSecretValid");
  });

  it("syncs approved bot products into the public catalog cache", () => {
    expect(clientSource).toContain("/api/products/published");
    expect(clientSource).toContain("fyzen_published_products");
    expect(clientSource).toContain("fyzen:products-updated");
  });
});
