import { describe, expect, it, vi } from "vitest";
import { BeerService } from "./beerService.js";

describe("BeerService", () => {
	it("気分キーワードを含むメッセージならおすすめが返る（決定的）", () => {
		const service = new BeerService();

		vi.spyOn(Math, "random").mockReturnValue(0);
		const rec = service.recommendBeer("疲れた");

		expect(rec).not.toBeNull();
		expect(rec?.mood).toBe("tired");
		expect(rec?.beer).toHaveProperty("name");
		expect(rec?.beer).toHaveProperty("description");
		expect(rec?.beer).toHaveProperty("url");
	});

	it("気分が判定できない場合はnullを返す", () => {
		const service = new BeerService();
		expect(service.recommendBeer("これは分類できないメッセージ")).toBeNull();
	});
});


