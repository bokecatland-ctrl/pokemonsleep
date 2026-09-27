import type { IngredientId } from './ingredients';

// 料理一覧（「ごちゃまぜ」系は食材の指定がないので除外）
// ※ 暫定データ。攻略サイトで料理名・必要個数を確認したら DATA_VERIFIED を true にする。
export const DATA_VERIFIED = false;

export type Category = 'curry' | 'salad' | 'dessert';

export const CATEGORY_LABEL: Record<Category, string> = {
  curry: 'カレー',
  salad: 'サラダ',
  dessert: 'デザート',
};

export type Requirement = Partial<Record<IngredientId, number>>;

export interface Recipe {
  id: string;
  name: string;
  category: Category;
  ingredients: Requirement;
}

export const RECIPES: Recipe[] = [
  // カレー・シチュー
  { id: 'fancy-apple-curry', name: 'とくせんリンゴカレー', category: 'curry', ingredients: { apple: 7 } },
  { id: 'mild-honey-curry', name: 'たっぷりハニーカレー', category: 'curry', ingredients: { honey: 7 } },
  { id: 'beanburger-curry', name: 'マメバーグカレー', category: 'curry', ingredients: { sausage: 7 } },
  { id: 'simple-chowder', name: 'ほっこりホワイトシチュー', category: 'curry', ingredients: { milk: 10 } },
  { id: 'hearty-cheeseburger-curry', name: 'ぜったいねむりバーグカレー', category: 'curry', ingredients: { milk: 8, sausage: 8 } },
  { id: 'solar-power-tomato-curry', name: 'サンパワートマトカレー', category: 'curry', ingredients: { tomato: 10, herb: 5 } },
  { id: 'drought-katsu-curry', name: 'ひでりカツレツカレー', category: 'curry', ingredients: { sausage: 10, oil: 5 } },
  { id: 'melty-omelette-curry', name: 'とろけるオムカレー', category: 'curry', ingredients: { egg: 10, tomato: 6 } },
  { id: 'bulk-up-bean-curry', name: 'ビルドアップマメカレー', category: 'curry', ingredients: { soybean: 12, sausage: 6, herb: 4, egg: 4 } },
  { id: 'spore-mushroom-curry', name: 'キノコのほうしカレー', category: 'curry', ingredients: { mushroom: 14, potato: 9 } },
  { id: 'egg-bomb-curry', name: 'たまごばくだんカレー', category: 'curry', ingredients: { honey: 12, apple: 11, egg: 8, potato: 4 } },
  { id: 'limber-corn-stew', name: 'じゅうなんコーンシチュー', category: 'curry', ingredients: { corn: 14, milk: 8, potato: 9 } },
  { id: 'spicy-leek-curry', name: 'からくちネギカレー', category: 'curry', ingredients: { leek: 14, ginger: 10, herb: 8 } },
  { id: 'dizzy-punch-curry', name: 'ピヨピヨパンチ辛口カレー', category: 'curry', ingredients: { coffee: 11, herb: 11, honey: 11 } },
  { id: 'grilled-tail-curry', name: 'あぶりテールカレー', category: 'curry', ingredients: { tail: 8, herb: 25 } },
  { id: 'dream-eater-butter-curry', name: 'ゆめくいバターカレー', category: 'curry', ingredients: { potato: 18, tomato: 15, cacao: 12, oil: 10 } },
  { id: 'ninja-curry', name: 'ニンジャカレー', category: 'curry', ingredients: { soybean: 24, mushroom: 9 } },
  { id: 'hidden-power-stew', name: 'めざめるパワーシチュー', category: 'curry', ingredients: { soybean: 28, tomato: 25, mushroom: 23, coffee: 16 } },

  // サラダ
  { id: 'fancy-apple-salad', name: 'とくせんリンゴサラダ', category: 'salad', ingredients: { apple: 8 } },
  { id: 'bean-ham-salad', name: 'マメハムサラダ', category: 'salad', ingredients: { sausage: 8 } },
  { id: 'snoozy-tomato-salad', name: 'あんみんトマトサラダ', category: 'salad', ingredients: { tomato: 8 } },
  { id: 'snow-cloak-caesar-salad', name: 'ゆきかきシーザーサラダ', category: 'salad', ingredients: { milk: 10, sausage: 6 } },
  { id: 'heat-wave-tofu-salad', name: 'ねっぷうとうふサラダ', category: 'salad', ingredients: { soybean: 10, herb: 6 } },
  { id: 'immunity-leek-salad', name: 'めんえきネギサラダ', category: 'salad', ingredients: { leek: 10, ginger: 5 } },
  { id: 'fury-attack-corn-salad', name: 'みだれづきコーンサラダ', category: 'salad', ingredients: { corn: 9, oil: 8 } },
  { id: 'water-veil-tofu-salad', name: 'みずのはどうとうふサラダ', category: 'salad', ingredients: { soybean: 15, tomato: 9 } },
  { id: 'dazzling-apple-cheese-salad', name: 'まぶしいアップルチーズサラダ', category: 'salad', ingredients: { apple: 15, milk: 5, oil: 3 } },
  { id: 'superpower-extreme-salad', name: 'ばかぢからワイルドサラダ', category: 'salad', ingredients: { sausage: 9, ginger: 6, egg: 5, potato: 3 } },
  { id: 'contrary-chocolate-meat-salad', name: 'あまのじゃくチョコミートサラダ', category: 'salad', ingredients: { cacao: 14, sausage: 9 } },
  { id: 'overheat-ginger-salad', name: 'オーバーヒートサラダ', category: 'salad', ingredients: { herb: 17, ginger: 10, tomato: 8 } },
  { id: 'gluttony-potato-salad', name: 'くいしんぼうポテトサラダ', category: 'salad', ingredients: { potato: 14, egg: 9, sausage: 7, apple: 6 } },
  { id: 'spore-mushroom-salad', name: 'キノコのほうしサラダ', category: 'salad', ingredients: { mushroom: 17, tomato: 8, oil: 8 } },
  { id: 'slowpoke-tail-pepper-salad', name: 'おいしいシッポのペッパーサラダ', category: 'salad', ingredients: { tail: 10, herb: 10, oil: 15 } },
  { id: 'calm-mind-fruit-salad', name: 'めいそうスイートサラダ', category: 'salad', ingredients: { apple: 21, honey: 16, ginger: 12 } },
  { id: 'ninja-salad', name: 'ニンジャサラダ', category: 'salad', ingredients: { leek: 15, soybean: 19, mushroom: 12, ginger: 11 } },
  { id: 'greengrass-salad', name: 'ワカクササラダ', category: 'salad', ingredients: { oil: 22, corn: 17, tomato: 14, potato: 9 } },

  // デザート・ドリンク
  { id: 'warm-moomoo-milk', name: 'モーモーホットミルク', category: 'dessert', ingredients: { milk: 7 } },
  { id: 'fancy-apple-juice', name: 'とくせんリンゴジュース', category: 'dessert', ingredients: { apple: 8 } },
  { id: 'craft-soda-pop', name: 'クラフトサイコソーダ', category: 'dessert', ingredients: { honey: 9 } },
  { id: 'ember-ginger-tea', name: 'ひのこのジンジャーティー', category: 'dessert', ingredients: { ginger: 9, apple: 7 } },
  { id: 'cloud-nine-soy-cake', name: 'ふわふわソイケーキ', category: 'dessert', ingredients: { egg: 8, soybean: 7 } },
  { id: 'hustle-protein-smoothie', name: 'はりきりプロテインスムージー', category: 'dessert', ingredients: { soybean: 15, cacao: 8 } },
  { id: 'big-malasada', name: 'おおきなマラサダ', category: 'dessert', ingredients: { oil: 10, milk: 7, honey: 6 } },
  { id: 'sweet-scent-chocolate-cake', name: 'あまいかおりチョコケーキ', category: 'dessert', ingredients: { honey: 9, cacao: 8, milk: 7 } },
  { id: 'neroli-restorative-tea', name: 'ネロリのデトックスティー', category: 'dessert', ingredients: { ginger: 11, apple: 15, mushroom: 9 } },
  { id: 'steadfast-ginger-cookies', name: 'ふくつのジンジャークッキー', category: 'dessert', ingredients: { honey: 14, ginger: 12, cacao: 5, egg: 4 } },
  { id: 'lovely-kiss-smoothie', name: 'あくまのキッスフルーツオレ', category: 'dessert', ingredients: { apple: 11, milk: 9, honey: 7, cacao: 8 } },
  { id: 'explosion-popcorn', name: 'ばくれつポップコーン', category: 'dessert', ingredients: { corn: 15, oil: 14, milk: 7 } },
  { id: 'jigglypuff-fruity-flan', name: 'プリンのプリンアラモード', category: 'dessert', ingredients: { honey: 20, egg: 15, milk: 10, apple: 10 } },
  { id: 'teatime-corn-scones', name: 'ティータイムコーンスコーン', category: 'dessert', ingredients: { apple: 20, ginger: 20, corn: 18, milk: 9 } },
  { id: 'flower-gift-macarons', name: 'フラワーギフトマカロン', category: 'dessert', ingredients: { cacao: 25, egg: 25, honey: 17, milk: 10 } },
];
