import { consume, matchRecipes } from './match';
import { INGREDIENT_BY_ID } from '../data/ingredients';
import { RECIPES, type Recipe } from '../data/recipes';

const curry = (id: string, ingredients: Recipe['ingredients']): Recipe => ({
  id,
  name: id,
  category: 'curry',
  ingredients,
});

const recipes: Recipe[] = [
  curry('small', { apple: 7 }),
  curry('big', { milk: 8, sausage: 8 }),
  { id: 'salad', name: 'salad', category: 'salad', ingredients: { apple: 1 } },
];

const opts = { category: 'curry' as const, potSize: 30, nearLimit: 10 };

describe('matchRecipes', () => {
  it('ちょうど足りる料理は作れる', () => {
    const { cookable } = matchRecipes(recipes, { apple: 7 }, opts);
    expect(cookable.map((r) => r.recipe.id)).toEqual(['small']);
  });

  it('1個足りない料理は「あと少し」に不足数付きで出る（同数なら食材の多い順）', () => {
    const { cookable, almost } = matchRecipes(recipes, { apple: 6, milk: 8, sausage: 7 }, opts);
    expect(cookable).toEqual([]);
    expect(almost.map((r) => [r.recipe.id, r.shortages])).toEqual([
      ['big', [{ id: 'sausage', missing: 1 }]],
      ['small', [{ id: 'apple', missing: 1 }]],
    ]);
  });

  it('鍋の容量を超える料理は出さない', () => {
    const { cookable } = matchRecipes(recipes, { apple: 99, milk: 99, sausage: 99 }, { ...opts, potSize: 15 });
    expect(cookable.map((r) => r.recipe.id)).toEqual(['small']);
  });

  it('カテゴリ違いは出さない', () => {
    const { cookable } = matchRecipes(recipes, { apple: 99 }, { ...opts, category: 'salad' });
    expect(cookable.map((r) => r.recipe.id)).toEqual(['salad']);
  });

  it('不足が上限を超える料理は「あと少し」に出さない', () => {
    const { almost } = matchRecipes(recipes, {}, { ...opts, nearLimit: 10 });
    expect(almost.map((r) => r.recipe.id)).toEqual(['small']);
  });

  it('作れる料理は食材の多い順', () => {
    const { cookable } = matchRecipes(recipes, { apple: 7, milk: 8, sausage: 8 }, opts);
    expect(cookable.map((r) => r.recipe.id)).toEqual(['big', 'small']);
  });
});

describe('consume', () => {
  it('使った食材を在庫から引く', () => {
    expect(consume({ apple: 10, milk: 1 }, recipes[0])).toEqual({ apple: 3, milk: 1 });
  });
});

describe('レシピデータ', () => {
  it('存在しない食材を使っていない', () => {
    for (const r of RECIPES) {
      for (const [id, n] of Object.entries(r.ingredients)) {
        expect(INGREDIENT_BY_ID[id as keyof typeof INGREDIENT_BY_ID], `${r.name}: ${id}`).toBeDefined();
        expect(n).toBeGreaterThan(0);
      }
    }
  });

  it('IDが重複していない', () => {
    expect(new Set(RECIPES.map((r) => r.id)).size).toBe(RECIPES.length);
  });
});
