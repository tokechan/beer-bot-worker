import { describe, expect, it, vi } from "vitest";

vi.mock("./lineSignature.js", () => ({
	verifyLineSignature: vi.fn(),
}));

vi.mock("../handlers/messageHandler.js", () => ({
	MessageHandler: class {
		public handleEvent = vi.fn().mockResolvedValue(undefined);
	},
}));

vi.mock("@line/bot-sdk", () => ({
	Client: class {},
}));

describe("lambda handler", () => {
	it("GET /health は200を返す", async () => {
		process.env.LINE_CHANNEL_ACCESS_TOKEN = "dummy-token";
		process.env.LINE_CHANNEL_SECRET = "dummy-secret";

		const mod = await import("./handler.js");
		const res = await mod.handler({ routeKey: "GET /health" } as any);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBe(JSON.stringify({ status: "ok" }));
	});

	it("POST /webhook 署名NGなら401", async () => {
		process.env.LINE_CHANNEL_ACCESS_TOKEN = "dummy-token";
		process.env.LINE_CHANNEL_SECRET = "dummy-secret";

		const { verifyLineSignature } = await import("./lineSignature.js");
		(verifyLineSignature as any).mockReturnValue(false);

		const mod = await import("./handler.js");
		const res = await mod.handler({
			routeKey: "POST /webhook",
			body: "{}",
			isBase64Encoded: false,
			headers: { "x-line-signature": "sig" },
		} as any);

		expect(res.statusCode).toBe(401);
	});
});


