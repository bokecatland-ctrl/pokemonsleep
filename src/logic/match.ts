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

export function matchRecipes(recipes: Recipe[], inventory: Inventory, opts: MatchOptions) {
  const candidates = recipes
    .filter((r) => r.category === opts.category && recipeTotal(r) <= opts.potSize)
    .map((r) => evaluate(r, inventory));

  // 食材の多い料理ほどエナジーが高いので、合計個数の多い順に並べる
  const cookable = candidates
    .filter((r) => r.missingTotal === 0)
    .sort((a, b) => b.total - a.total);

  const almost = candidates
    .filter((r) => r.missingTotal > 0 && r.missingTotal <= opts.nearLimit)
    .sort((a, b) => a.missingTotal - b.missingTotal || b.total - a.total);

  return { cookable, almost };
}

export function consume(inventory: Inventory, recipe: Recipe): Inventory {
  const next = { ...inventory };
  for (const [id, need] of Object.entries(recipe.ingredients) as [IngredientId, number][]) {
    next[id] = Math.max(0, (next[id] ?? 0) - need);
  }
  return next;
}
