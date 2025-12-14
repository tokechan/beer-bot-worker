import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyLineSignature } from "./lineSignature.js";

describe("verifyLineSignature", () => {
	it("bodyなしならfalse", () => {
		expect(verifyLineSignature(null, false, "sig", "secret")).toBe(false);
	});

	it("signatureなしならfalse", () => {
		expect(verifyLineSignature("{}", false, null, "secret")).toBe(false);
	});

	it("正しい署名ならtrue（非base64）", () => {
		const secret = "test-secret";
		const raw = "{\"hello\":\"world\"}";
		const signature = createHmac("SHA256", secret).update(raw).digest("base64");

		expect(verifyLineSignature(raw, false, signature, secret)).toBe(true);
	});

	it("正しい署名ならtrue（base64）", () => {
		const secret = "test-secret";
		const raw = "{\"a\":1}";
		const bodyBase64 = Buffer.from(raw, "utf-8").toString("base64");
		const signature = createHmac("SHA256", secret)
			.update(Buffer.from(bodyBase64, "base64"))
			.digest("base64");

		expect(verifyLineSignature(bodyBase64, true, signature, secret)).toBe(true);
	});
});


