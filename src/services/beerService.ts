import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface Beer {
  name: string;
  description: string;
  url: string;
}

export interface BeerRecommendation {
  mood: string;
  beer: Beer;
}

type MoodKey = "relax" | "tired" | "refresh";

type BeersData = {
  moods: Record<
    MoodKey,
    {
      keywords: string[];
      beers: Beer[];
    }
  >;
};

function loadBeersData(): BeersData {
  // 開発時: src/services/beerService.ts から ../data/beers.json を参照
  // ビルド後: dist/services/beerService.js から ../data/beers.json を参照
  const here = dirname(fileURLToPath(import.meta.url));
  const jsonPath = join(here, "..", "data", "beers.json");
  const raw = readFileSync(jsonPath, "utf-8");
  return JSON.parse(raw) as BeersData;
}

/**
 * ユーザーのメッセージから気分を判定し、適切なビールを推薦する
 */
export class BeerService {
  private beers = loadBeersData().moods;

  /**
   * メッセージから気分を判定する
   */
  private detectMood(message: string): MoodKey | null {
    const normalizedMessage = message.toLowerCase().trim();

    // 各気分カテゴリのキーワードをチェック
    for (const [moodKey, moodData] of Object.entries(this.beers)) {
      for (const keyword of moodData.keywords) {
        if (normalizedMessage.includes(keyword.toLowerCase())) {
          return moodKey as MoodKey;
        }
      }
    }

    return null;
  }

  /**
   * 気分に応じたビールをランダムに推薦する
   */
  recommendBeer(message: string): BeerRecommendation | null {
    const mood = this.detectMood(message);

    if (!mood) {
      return null;
    }

    const availableBeers = this.beers[mood as MoodKey].beers;

    // ランダムに1つ選択
    const randomIndex = Math.floor(Math.random() * availableBeers.length);
    const selectedBeer = availableBeers[randomIndex];

    return {
      mood,
      beer: selectedBeer,
    };
  }

  /**
   * 初期メッセージを取得する
   */
  getInitialMessage(): string {
    return "今の気分は？\n\n例：\n・リラックスしたい\n・疲れた\n・スッキリしたい";
  }

  /**
   * 気分が判定できない場合のメッセージを取得する
   */
  getUnknownMoodMessage(): string {
    return "すみません、気分がよくわかりませんでした。\n\n以下のような気分を教えてください：\n・リラックスしたい\n・疲れた\n・スッキリしたい";
  }
}
