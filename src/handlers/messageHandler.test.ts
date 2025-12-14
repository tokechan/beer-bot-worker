import { describe, expect, it, vi } from "vitest";
import { MessageHandler } from "./messageHandler.js";

describe("MessageHandler", () => {
	it("挨拶メッセージには初期メッセージを返信する", async () => {
		const replyMessage = vi.fn().mockResolvedValue(undefined);
		const fakeClient = { replyMessage } as any;
		const handler = new MessageHandler(fakeClient);

		const event = {
			type: "message",
			message: { type: "text", id: "1", text: "こんにちは" },
			replyToken: "replyToken",
			timestamp: Date.now(),
			source: { type: "user", userId: "Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
		} as any;

		await handler.handleEvent(event);

		expect(replyMessage).toHaveBeenCalledTimes(1);
		const [token, payload] = replyMessage.mock.calls[0];
		expect(token).toBe("replyToken");
		expect(payload.type).toBe("text");
		expect(payload.text).toContain("今の気分は？");
	});
});


