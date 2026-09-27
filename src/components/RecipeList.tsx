import { INGREDIENT_BY_ID, type IngredientId } from '../data/ingredients';
import type { RecipeResult } from '../logic/match';

interface Props {
  results: RecipeResult[];
  empty: string;
  onCook?: (result: RecipeResult) => void;
}

export function RecipeList({ results, empty, onCook }: Props) {
  if (results.length === 0) return <p className="empty-msg">{empty}</p>;
  return (
    <ul className="recipes">
      {results.map((r) => (
        <li key={r.recipe.id} className="recipe">
          <div className="recipe-head">
            <span className="recipe-name">{r.recipe.name}</span>
            <span className="recipe-total">
              食材{r.total}個・{r.recipe.baseStrength.toLocaleString()}
            </span>
          </div>
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
          {onCook && (
            <button type="button" className="cook" onClick={() => onCook(r)}>
              作った（在庫から引く）
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
