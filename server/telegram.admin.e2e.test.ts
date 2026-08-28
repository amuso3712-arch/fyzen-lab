import { beforeEach, describe, expect, it, vi } from "vitest";

const state = new Map<string, { chatId: string; step: string; payloadJson: string; lastUpdateId: number | null }>();
const insertSpy = vi.fn();
const sendSpy = vi.fn();

vi.mock("./db", () => ({
  getDb: vi.fn(async () => ({
    select: () => ({ from: () => ({ where: (condition: unknown) => ({ limit: async () => {
      const chatId = [...state.keys()][0];
      return chatId && state.has(chatId) ? [state.get(chatId)] : [];
    } }) }) }),
    insert: () => ({ values: (value: any) => ({ onDuplicateKeyUpdate: async ({ set }: any) => {
      const chatId = value.chatId;
      state.set(chatId, { chatId, step: set.step || value.step, payloadJson: set.payloadJson || value.payloadJson, lastUpdateId: set.lastUpdateId ?? value.lastUpdateId ?? null });
      insertSpy(value);
    } }) }),
    update: () => ({ set: () => ({ where: async () => undefined }) }),
  }))
}));
vi.mock("./storage", () => ({ storagePut: vi.fn(async () => ({ url: "/manus-storage/test.jpg" })) }));

describe("Telegram admin webhook flow", () => {
  beforeEach(() => {
    state.clear(); insertSpy.mockClear(); sendSpy.mockClear();
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    global.fetch = vi.fn(async (input: any) => {
      if (String(input).includes("sendMessage")) { sendSpy(input); return new Response(JSON.stringify({ ok: true, result: {} }), { status: 200 }); }
      if (String(input).includes("getFile")) return new Response(JSON.stringify({ ok: true, result: { file_path: "photos/test.jpg" } }), { status: 200 });
      if (String(input).includes("/file/bot")) return new Response(new Uint8Array([1, 2, 3]), { status: 200 });
      return new Response(JSON.stringify({ ok: true, result: {} }), { status: 200 });
    }) as any;
  });

  it("ignores unauthorized Telegram users", async () => {
    const { handleTelegramAdminUpdate } = await import("./telegramAdmin");
    await handleTelegramAdminUpdate({ update_id: 1, message: { from: { id: 123 }, chat: { id: 77 }, text: "/admin" } });
    expect(sendSpy).toHaveBeenCalled();
    expect(sendSpy.mock.calls[0][0]).toContain("sendMessage");
  });

  it("walks an authorized order wizard and persists the order", async () => {
    const { handleTelegramAdminUpdate } = await import("./telegramAdmin");
    const chat = { id: 77 };
    await handleTelegramAdminUpdate({ update_id: 1, callback_query: { id: "c1", from: { id: 7812685703 }, data: "order:add", message: { chat } } });
    await handleTelegramAdminUpdate({ update_id: 2, message: { from: { id: 7812685703 }, chat, text: "Test Client" } });
    await handleTelegramAdminUpdate({ update_id: 3, message: { from: { id: 7812685703 }, chat, text: "+998901234567" } });
    await handleTelegramAdminUpdate({ update_id: 4, message: { from: { id: 7812685703 }, chat, text: "Fyzen Lab" } });
    await handleTelegramAdminUpdate({ update_id: 5, message: { from: { id: 7812685703 }, chat, text: "Mindray BC-5000 x1" } });
    await handleTelegramAdminUpdate({ update_id: 6, callback_query: { id: "c2", from: { id: 7812685703 }, data: "order:save", message: { chat } } });
    expect(insertSpy).toHaveBeenCalled();
    expect(sendSpy).toHaveBeenCalled();
  });

  it("does not accept an oversized product photo", async () => {
    const { handleTelegramAdminUpdate } = await import("./telegramAdmin");
    const chat = { id: 77 };
    await handleTelegramAdminUpdate({ update_id: 1, callback_query: { id: "c1", from: { id: 7812685703 }, data: "product:add", message: { chat } } });
    // Move the mocked wizard directly to photo input for a focused size guardrail.
    state.set("77", { chatId: "77", step: "photo", payloadJson: JSON.stringify({ name: "Test", brand: "FYZEN", category: "medical", price: "Request", description: "Test" }), lastUpdateId: 1 });
    await handleTelegramAdminUpdate({ update_id: 2, message: { from: { id: 7812685703 }, chat, photo: [{ file_id: "large", file_size: 9 * 1024 * 1024 }] } });
    expect(sendSpy).toHaveBeenCalled();
  });
});
