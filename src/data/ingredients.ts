// 食材一覧（ゲーム内の並び順）
// ※ 暫定データ。攻略サイトとの突き合わせが済むまで DATA_VERIFIED は false のままにする。

export type IngredientId =
  | 'leek'
  | 'mushroom'
  | 'egg'
  | 'potato'
  | 'apple'
  | 'herb'
  | 'sausage'
  | 'milk'
  | 'honey'
  | 'oil'
  | 'ginger'
  | 'tomato'
  | 'cacao'
  | 'tail'
  | 'soybean'
  | 'corn'
  | 'coffee'
  | 'pumpkin'
  | 'avocado';

export interface Ingredient {
  id: IngredientId;
  name: string;
  icon: string;
}

export const INGREDIENTS: Ingredient[] = [
  { id: 'leek', name: 'ふといながねぎ', icon: '🥬' },
  { id: 'mushroom', name: 'あじわいキノコ', icon: '🍄' },
  { id: 'egg', name: 'とくせんエッグ', icon: '🥚' },
  { id: 'potato', name: 'ほっこりポテト', icon: '🥔' },
  { id: 'apple', name: 'とくせんリンゴ', icon: '🍎' },
  { id: 'herb', name: 'げきからハーブ', icon: '🌶️' },
  { id: 'sausage', name: 'マメミート', icon: '🌭' },
  { id: 'milk', name: 'モーモーミルク', icon: '🥛' },
  { id: 'honey', name: 'あまいミツ', icon: '🍯' },
  { id: 'oil', name: 'ピュアなオイル', icon: '🫒' },
  { id: 'ginger', name: 'あったかジンジャー', icon: '🫚' },
  { id: 'tomato', name: 'あんみんトマト', icon: '🍅' },
  { id: 'cacao', name: 'リラックスカカオ', icon: '🍫' },
  { id: 'tail', name: 'おいしいシッポ', icon: '🍖' },
  { id: 'soybean', name: 'ワカクサ大豆', icon: '🫘' },
  { id: 'corn', name: 'ワカクサコーン', icon: '🌽' },
  { id: 'coffee', name: 'めざましコーヒー', icon: '☕' },
  { id: 'pumpkin', name: 'ずっしりカボチャ', icon: '🎃' },
  { id: 'avocado', name: 'つやつやアボカド', icon: '🥑' },
];

export const INGREDIENT_BY_ID: Record<IngredientId, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((i) => [i.id, i]),
) as Record<IngredientId, Ingredient>;
