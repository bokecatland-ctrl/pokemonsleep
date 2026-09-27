import type { IngredientId } from './ingredients';

// 料理一覧（「ごちゃまぜ」系は食材の指定がないので除外）
// 出典: pks.raenonx.cc（料理名・必要個数・基本エナジー）。必要個数は serebii.net とも照合済み（2026-09-27、全78品）。
// 新しい料理が追加されたら、ここに1行足す。id はゲーム内の料理ID。
export const DATA_VERIFIED = true;

export type Category = 'curry' | 'salad' | 'dessert';

export const CATEGORY_LABEL: Record<Category, string> = {
  curry: 'カレー',
  salad: 'サラダ',
  dessert: 'デザート',
};

export type Requirement = Partial<Record<IngredientId, number>>;

export interface Recipe {
  id: number;
  name: string;
  category: Category;
  // レシピレベル1のときの料理のエナジー（食材ボーナスなど抜き）
  baseStrength: number;
  ingredients: Requirement;
}

export const RECIPES: Recipe[] = [
  // カレー・シチュー
  { id: 1001, name: 'とくせんリンゴカレー', category: 'curry', baseStrength: 748, ingredients: { apple: 7 } },
  { id: 1002, name: 'あぶりテールカレー', category: 'curry', baseStrength: 7483, ingredients: { tail: 8, herb: 25 } },
  { id: 1003, name: 'サンパワートマトカレー', category: 'curry', baseStrength: 2078, ingredients: { tomato: 10, herb: 5 } },
  { id: 1004, name: 'ぜったいねむりバターカレー', category: 'curry', baseStrength: 9010, ingredients: { potato: 18, tomato: 15, cacao: 12, milk: 10 } },
  { id: 1005, name: 'からくちネギもりカレー', category: 'curry', baseStrength: 5900, ingredients: { leek: 14, ginger: 10, herb: 8 } },
  { id: 1006, name: 'キノコのほうしカレー', category: 'curry', baseStrength: 4162, ingredients: { mushroom: 14, potato: 9 } },
  { id: 1007, name: 'おやこあいカレー', category: 'curry', baseStrength: 4523, ingredients: { honey: 12, apple: 11, egg: 8, potato: 4 } },
  { id: 1008, name: '満腹チーズバーグカレー', category: 'curry', baseStrength: 1910, ingredients: { milk: 8, sausage: 8 } },
  { id: 1009, name: 'ほっこりホワイトシチュー', category: 'curry', baseStrength: 3181, ingredients: { milk: 10, potato: 8, mushroom: 4 } },
  { id: 1010, name: 'たんじゅんホワイトシチュー', category: 'curry', baseStrength: 814, ingredients: { milk: 7 } },
  { id: 1011, name: 'マメバーグカレー', category: 'curry', baseStrength: 856, ingredients: { sausage: 7 } },
  { id: 1012, name: 'ベイビィハニーカレー', category: 'curry', baseStrength: 839, ingredients: { honey: 7 } },
  { id: 1013, name: 'ニンジャカレー', category: 'curry', baseStrength: 9445, ingredients: { soybean: 24, sausage: 9, leek: 12, mushroom: 5 } },
  { id: 1014, name: 'ひでりカツレツカレー', category: 'curry', baseStrength: 1942, ingredients: { sausage: 10, oil: 5 } },
  { id: 1015, name: 'とけるオムカレー', category: 'curry', baseStrength: 2150, ingredients: { egg: 10, tomato: 6 } },
  { id: 1016, name: 'ビルドアップマメカレー', category: 'curry', baseStrength: 3372, ingredients: { soybean: 12, sausage: 6, herb: 4, egg: 4 } },
  { id: 1017, name: 'じゅうなんコーンシチュー', category: 'curry', baseStrength: 4670, ingredients: { corn: 14, milk: 8, potato: 8 } },
  { id: 1018, name: 'れんごくコーンキーマカレー', category: 'curry', baseStrength: 13690, ingredients: { herb: 27, sausage: 24, corn: 14, ginger: 12 } },
  { id: 1019, name: 'ピヨピヨパンチ辛口カレー', category: 'curry', baseStrength: 5702, ingredients: { coffee: 11, herb: 11, honey: 11 } },
  { id: 1020, name: 'めざめるパワーシチュー', category: 'curry', baseStrength: 19061, ingredients: { soybean: 28, tomato: 25, mushroom: 23, coffee: 16 } },
  { id: 1021, name: 'いあいぎりすき焼きカレー', category: 'curry', baseStrength: 20655, ingredients: { leek: 27, sausage: 26, honey: 26, egg: 22 } },
  { id: 1022, name: 'なりきりバケッチャシチュー', category: 'curry', baseStrength: 15621, ingredients: { pumpkin: 10, sausage: 16, potato: 18, mushroom: 25 } },
  { id: 1023, name: 'しんりょくアボカドグラタン', category: 'curry', baseStrength: 24802, ingredients: { avocado: 22, potato: 20, milk: 41, oil: 32 } },
  { id: 1024, name: 'ワカクサカレーパン', category: 'curry', baseStrength: 10945, ingredients: { ginger: 20, herb: 20, soybean: 8, oil: 15 } },
  { id: 1025, name: 'とびはねるカレーうどん', category: 'curry', baseStrength: 25539, ingredients: { ginger: 39, mushroom: 31, herb: 22, sausage: 20 } },

  // サラダ
  { id: 2001, name: 'ヤドンテールのペッパーサラダ', category: 'salad', baseStrength: 8169, ingredients: { tail: 10, herb: 10, oil: 15 } },
  { id: 2002, name: 'キノコのほうしサラダ', category: 'salad', baseStrength: 5859, ingredients: { mushroom: 17, tomato: 8, oil: 8 } },
  { id: 2003, name: 'ゆきかきシーザーサラダ', category: 'salad', baseStrength: 1898, ingredients: { milk: 10, sausage: 6 } },
  { id: 2004, name: 'くいしんぼうポテトサラダ', category: 'salad', baseStrength: 5040, ingredients: { potato: 14, egg: 9, sausage: 7, apple: 6 } },
  { id: 2005, name: 'うるおいとうふサラダ', category: 'salad', baseStrength: 3113, ingredients: { soybean: 15, tomato: 9 } },
  { id: 2006, name: 'ばかぢからワイルドサラダ', category: 'salad', baseStrength: 3046, ingredients: { sausage: 9, ginger: 6, egg: 5, potato: 3 } },
  { id: 2007, name: 'マメハムサラダ', category: 'salad', baseStrength: 978, ingredients: { sausage: 8 } },
  { id: 2008, name: 'あんみんトマトサラダ', category: 'salad', baseStrength: 1045, ingredients: { tomato: 8 } },
  { id: 2009, name: 'モーモーカプレーゼ', category: 'salad', baseStrength: 2942, ingredients: { milk: 12, tomato: 6, oil: 5 } },
  { id: 2010, name: 'ムラっけチョコミートサラダ', category: 'salad', baseStrength: 3665, ingredients: { cacao: 14, sausage: 9 } },
  { id: 2011, name: 'オーバーヒートサラダ', category: 'salad', baseStrength: 5225, ingredients: { herb: 17, ginger: 10, tomato: 8 } },
  { id: 2012, name: 'とくせんリンゴサラダ', category: 'salad', baseStrength: 855, ingredients: { apple: 8 } },
  { id: 2013, name: 'めんえきねぎサラダ', category: 'salad', baseStrength: 2845, ingredients: { leek: 10, ginger: 5 } },
  { id: 2014, name: 'メロメロりんごのチーズサラダ', category: 'salad', baseStrength: 2655, ingredients: { apple: 15, milk: 5, oil: 3 } },
  { id: 2015, name: 'ニンジャサラダ', category: 'salad', baseStrength: 11659, ingredients: { leek: 15, soybean: 19, mushroom: 12, ginger: 11 } },
  { id: 2016, name: 'ねっぷうとうふサラダ', category: 'salad', baseStrength: 2114, ingredients: { soybean: 10, herb: 6 } },
  { id: 2017, name: 'ワカクササラダ', category: 'salad', baseStrength: 11393, ingredients: { oil: 22, corn: 17, tomato: 14, potato: 9 } },
  { id: 2018, name: 'めいそうスイートサラダ', category: 'salad', baseStrength: 7675, ingredients: { apple: 21, honey: 16, corn: 12 } },
  { id: 2019, name: 'みだれづきコーンサラダ', category: 'salad', baseStrength: 2785, ingredients: { corn: 9, oil: 8 } },
  { id: 2020, name: 'クロスチョップドサラダ', category: 'salad', baseStrength: 8755, ingredients: { egg: 20, sausage: 15, corn: 11, tomato: 10 } },
  { id: 2021, name: 'まけんきコーヒーサラダ', category: 'salad', baseStrength: 20218, ingredients: { coffee: 28, sausage: 28, oil: 22, potato: 22 } },
  { id: 2022, name: 'はなふぶきミモザサラダ', category: 'salad', baseStrength: 11881, ingredients: { egg: 25, oil: 17, potato: 15, sausage: 12 } },
  { id: 2023, name: 'りんごさんヨーグルトサラダ', category: 'salad', baseStrength: 19293, ingredients: { egg: 35, apple: 28, tomato: 23, milk: 18 } },
  { id: 2024, name: 'くだけるアボカドサラダ', category: 'salad', baseStrength: 7125, ingredients: { avocado: 14, soybean: 18, oil: 10 } },
  { id: 2025, name: 'じならしワカモレチップス', category: 'salad', baseStrength: 25162, ingredients: { avocado: 28, corn: 25, herb: 30, soybean: 22 } },
  { id: 2026, name: 'ごろごろねっとうサラダ', category: 'salad', baseStrength: 25356, ingredients: { pumpkin: 20, potato: 30, corn: 18, mushroom: 27 } },

  // デザート・ドリンク
  { id: 3001, name: 'じゅくせいスイートポテト', category: 'dessert', baseStrength: 1907, ingredients: { potato: 9, milk: 5 } },
  { id: 3002, name: 'ふくつのジンジャークッキー', category: 'dessert', baseStrength: 4921, ingredients: { honey: 14, ginger: 12, cacao: 5, egg: 4 } },
  { id: 3003, name: 'とくせんリンゴジュース', category: 'dessert', baseStrength: 855, ingredients: { apple: 8 } },
  { id: 3004, name: 'クラフトサイコソーダ', category: 'dessert', baseStrength: 1079, ingredients: { honey: 9 } },
  { id: 3005, name: 'ひのこのジンジャーティー', category: 'dessert', baseStrength: 1913, ingredients: { ginger: 9, apple: 7 } },
  { id: 3006, name: 'プリンのプリンアラモード', category: 'dessert', baseStrength: 7594, ingredients: { honey: 20, egg: 15, milk: 10, apple: 10 } },
  { id: 3007, name: 'あくまのキッスフルーツオレ', category: 'dessert', baseStrength: 4734, ingredients: { apple: 11, milk: 9, honey: 7, cacao: 8 } },
  { id: 3008, name: 'ねがいごとアップルパイ', category: 'dessert', baseStrength: 1748, ingredients: { apple: 12, milk: 4 } },
  { id: 3009, name: 'ネロリのデトックスティー', category: 'dessert', baseStrength: 5065, ingredients: { ginger: 11, apple: 15, mushroom: 9 } },
  { id: 3010, name: 'あまいかおりチョコケーキ', category: 'dessert', baseStrength: 3378, ingredients: { honey: 9, cacao: 8, milk: 7 } },
  { id: 3011, name: 'モーモーホットミルク', category: 'dessert', baseStrength: 814, ingredients: { milk: 7 } },
  { id: 3012, name: 'かるわざソイケーキ', category: 'dessert', baseStrength: 1924, ingredients: { egg: 8, soybean: 7 } },
  { id: 3013, name: 'はりきりプロテインスムージー', category: 'dessert', baseStrength: 3263, ingredients: { soybean: 15, cacao: 8 } },
  { id: 3014, name: 'マイペースやさいジュース', category: 'dessert', baseStrength: 1924, ingredients: { tomato: 9, apple: 7 } },
  { id: 3015, name: 'おおきいマラサダ', category: 'dessert', baseStrength: 3015, ingredients: { oil: 10, milk: 7, honey: 6 } },
  { id: 3016, name: 'ちからもちソイドーナッツ', category: 'dessert', baseStrength: 5547, ingredients: { oil: 12, soybean: 16, cacao: 7 } },
  { id: 3017, name: 'だいばくはつポップコーン', category: 'dessert', baseStrength: 6048, ingredients: { corn: 15, oil: 14, milk: 7 } },
  { id: 3018, name: 'おちゃかいコーンスコーン', category: 'dessert', baseStrength: 10925, ingredients: { apple: 20, ginger: 20, corn: 18, milk: 9 } },
  { id: 3019, name: 'はなびらのまいチョコタルト', category: 'dessert', baseStrength: 3314, ingredients: { cacao: 11, apple: 11 } },
  { id: 3020, name: 'フラワーギフトマカロン', category: 'dessert', baseStrength: 13834, ingredients: { cacao: 25, egg: 25, honey: 17, milk: 10 } },
  { id: 3021, name: 'はやおきコーヒーゼリー', category: 'dessert', baseStrength: 6793, ingredients: { coffee: 16, milk: 14, honey: 12 } },
  { id: 3022, name: 'スパークスパイスコーラ', category: 'dessert', baseStrength: 17494, ingredients: { apple: 35, ginger: 20, leek: 20, coffee: 12 } },
  { id: 3023, name: 'かたやぶりコーンティラミス', category: 'dessert', baseStrength: 7125, ingredients: { coffee: 14, corn: 14, milk: 12 } },
  { id: 3024, name: 'ドオーのエクレア', category: 'dessert', baseStrength: 20885, ingredients: { cacao: 30, milk: 26, coffee: 24, honey: 22 } },
  { id: 3025, name: 'ドキドキこわいかおパンケーキ', category: 'dessert', baseStrength: 24354, ingredients: { pumpkin: 18, egg: 24, honey: 32, tomato: 29 } },
  { id: 3026, name: 'グラスミキサースムージー', category: 'dessert', baseStrength: 8165, ingredients: { avocado: 18, tomato: 16, milk: 14 } },
  { id: 3027, name: 'みつあつめチョコワッフル', category: 'dessert', baseStrength: 25484, ingredients: { honey: 38, corn: 28, oil: 28, cacao: 21 } },
];
