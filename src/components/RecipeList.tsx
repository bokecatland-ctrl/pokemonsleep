import { INGREDIENT_BY_ID, type IngredientId } from '../data/ingredients';
import type { ListedRecipe, RecipeResult } from '../logic/match';

interface Props {
  results: (RecipeResult | ListedRecipe)[];
  empty: string;
  // 全レシピ一覧用: 作れるか・鍋に入るかの印を出す
  showStatus?: boolean;
}

export function RecipeList({ results, empty, showStatus }: Props) {
  if (results.length === 0) return <p className="empty-msg">{empty}</p>;
  return (
    <ul className="recipes">
      {results.map((r) => {
        const tooBig = 'fitsPot' in r && !r.fitsPot;
        return (
          <li key={r.recipe.id} className={`recipe${showStatus && tooBig ? ' too-big' : ''}`}>
            <div className="recipe-head">
              <span className="recipe-name">
                {r.recipe.name}
                {showStatus && !tooBig && r.missingTotal === 0 && <span className="tag ok">作れる</span>}
              </span>
              <span className="recipe-total">
                食材{r.total}個・{r.recipe.baseStrength.toLocaleString()}
              </span>
            </div>
            {showStatus && tooBig && <p className="recipe-note">鍋に入らない</p>}
            <div className="recipe-ings">
              {(Object.entries(r.recipe.ingredients) as [IngredientId, number][]).map(([id, need]) => {
                const short = r.shortages.find((s) => s.id === id);
                const ing = INGREDIENT_BY_ID[id];
                return (
                  <span key={id} className={`chip${short ? ' short' : ''}`} title={ing.name}>
                    {ing.icon}×{need}
                    {short && <b> あと{short.missing}</b>}
                  </span>
                );
              })}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
