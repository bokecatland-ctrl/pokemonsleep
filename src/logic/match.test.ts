import { listAll, matchRecipes } from './match';
import { INGREDIENT_BY_ID } from '../data/ingredients';
import { RECIPES, type Recipe } from '../data/recipes';

const curry = (id: number, name: string, baseStrength: number, ingredients: Recipe['ingredients']): Recipe => ({
  id,
  name,
  category: 'curry',
  baseStrength,
  ingredients,
});

const recipes: Recipe[] = [
  curry(1, 'small', 700, { apple: 7 }),
  curry(2, 'big', 1900, { milk: 8, sausage: 8 }),
  { id: 3, name: 'salad', category: 'salad', baseStrength: 100, ingredients: { apple: 1 } },
];


const opts = { category: 'curry' as const, potSize: 30, nearLimit: 10 };

describe('matchRecipes', () => {
  it('ちょうど足りる料理は作れる', () => {
    const { cookable } = matchRecipes(recipes, { apple: 7 }, opts);
    expect(cookable.map((r) => r.recipe.name)).toEqual(['small']);
  });

  it('1個足りない料理は「あと少し」に不足数付きで出る（同数ならエナジーの高い順）', () => {
    const { cookable, almost } = matchRecipes(recipes, { apple: 6, milk: 8, sausage: 7 }, opts);
    expect(cookable).toEqual([]);
    expect(almost.map((r) => [r.recipe.name, r.shortages])).toEqual([
      ['big', [{ id: 'sausage', missing: 1 }]],
      ['small', [{ id: 'apple', missing: 1 }]],
    ]);
  });

  it('鍋の容量を超える料理は出さない', () => {
    const { cookable } = matchRecipes(recipes, { apple: 99, milk: 99, sausage: 99 }, { ...opts, potSize: 15 });
    expect(cookable.map((r) => r.recipe.name)).toEqual(['small']);
  });

  it('カテゴリ違いは出さない', () => {
    const { cookable } = matchRecipes(recipes, { apple: 99 }, { ...opts, category: 'salad' });
    expect(cookable.map((r) => r.recipe.name)).toEqual(['salad']);
  });

  it('不足が上限を超える料理は「あと少し」に出さない', () => {
    const { almost } = matchRecipes(recipes, {}, { ...opts, nearLimit: 10 });
    expect(almost.map((r) => r.recipe.name)).toEqual(['small']);
  });

  it('作れる料理はエナジーの高い順', () => {
    const { cookable } = matchRecipes(recipes, { apple: 7, milk: 8, sausage: 8 }, opts);
    expect(cookable.map((r) => r.recipe.name)).toEqual(['big', 'small']);
  });
});

describe('listAll', () => {
  const all = (uses: Parameters<typeof listAll>[2]['uses'] = [], potSize = 15) =>
    listAll(recipes, { apple: 7 }, { category: 'curry', potSize, uses });

  it('カテゴリの全料理をエナジー順に出す', () => {
    expect(all().map((r) => r.recipe.name)).toEqual(['big', 'small']);
  });

  it('鍋に入らない料理も fitsPot=false で出す', () => {
    expect(all().map((r) => [r.recipe.name, r.fitsPot])).toEqual([
      ['big', false],
      ['small', true],
    ]);
  });

  it('足りない食材を出す', () => {
    const big = all().find((r) => r.recipe.name === 'big')!;
    expect(big.shortages).toEqual([
      { id: 'milk', missing: 8 },
      { id: 'sausage', missing: 8 },
    ]);
    expect(all().find((r) => r.recipe.name === 'small')!.missingTotal).toBe(0);
  });

  it('食材で絞り込む（複数選ぶと全部を使う料理だけ）', () => {
    expect(all(['milk']).map((r) => r.recipe.name)).toEqual(['big']);
    expect(all(['milk', 'sausage']).map((r) => r.recipe.name)).toEqual(['big']);
    expect(all(['milk', 'apple'])).toEqual([]);
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

  it('全カテゴリに料理がある', () => {
    for (const c of ['curry', 'salad', 'dessert'] as const) {
      expect(RECIPES.filter((r) => r.category === c).length).toBeGreaterThan(0);
    }
  });
});
