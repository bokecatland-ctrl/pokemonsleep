import type { IngredientId } from '../data/ingredients';
import type { Category, Recipe } from '../data/recipes';

export type Inventory = Partial<Record<IngredientId, number>>;

export interface Shortage {
  id: IngredientId;
  missing: number;
}

export interface RecipeResult {
  recipe: Recipe;
  total: number;
  shortages: Shortage[];
  missingTotal: number;
}

export interface MatchOptions {
  category: Category;
  potSize: number;
  // 不足が合計この個数以下なら「あと少し」に出す
  nearLimit: number;
}

export function recipeTotal(recipe: Recipe): number {
  return Object.values(recipe.ingredients).reduce((sum, n) => sum + (n ?? 0), 0);
}

export function evaluate(recipe: Recipe, inventory: Inventory): RecipeResult {
  const shortages: Shortage[] = [];
  for (const [id, need] of Object.entries(recipe.ingredients) as [IngredientId, number][]) {
    const have = inventory[id] ?? 0;
    if (have < need) shortages.push({ id, missing: need - have });
  }
  return {
    recipe,
    total: recipeTotal(recipe),
    shortages,
    missingTotal: shortages.reduce((sum, s) => sum + s.missing, 0),
  };
}

const byStrength = (a: RecipeResult, b: RecipeResult) => b.recipe.baseStrength - a.recipe.baseStrength;

export function matchRecipes(recipes: Recipe[], inventory: Inventory, opts: MatchOptions) {
  const candidates = recipes
    .filter((r) => r.category === opts.category && recipeTotal(r) <= opts.potSize)
    .map((r) => evaluate(r, inventory));

  const cookable = candidates.filter((r) => r.missingTotal === 0).sort(byStrength);

  const almost = candidates
    .filter((r) => r.missingTotal > 0 && r.missingTotal <= opts.nearLimit)
    .sort((a, b) => a.missingTotal - b.missingTotal || byStrength(a, b));

  return { cookable, almost };
}

export interface ListedRecipe extends RecipeResult {
  fitsPot: boolean;
}

export interface ListOptions {
  category: Category;
  potSize: number;
  // ここで選んだ食材をすべて使う料理だけにする（空なら全部）
  uses: IngredientId[];
}

// 全レシピ一覧。鍋に入らない料理も含め、エナジーの高い順に並べる。
export function listAll(recipes: Recipe[], inventory: Inventory, opts: ListOptions): ListedRecipe[] {
  return recipes
    .filter((r) => r.category === opts.category && opts.uses.every((id) => (r.ingredients[id] ?? 0) > 0))
    .map((r) => {
      const result = evaluate(r, inventory);
      return { ...result, fitsPot: result.total <= opts.potSize };
    })
    .sort(byStrength);
}
