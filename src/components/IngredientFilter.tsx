import { INGREDIENTS, type IngredientId } from '../data/ingredients';

interface Props {
  // このカテゴリの料理で使われる食材だけを出す
  available: Set<IngredientId>;
  selected: IngredientId[];
  onChange: (selected: IngredientId[]) => void;
}

export function IngredientFilter({ available, selected, onChange }: Props) {
  const toggle = (id: IngredientId) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  return (
    <div className="filter">
      <div className="filter-head">
        <span>食材で絞り込む</span>
        {selected.length > 0 && (
          <button type="button" className="link" onClick={() => onChange([])}>
            解除
          </button>
        )}
      </div>
      <div className="filter-chips">
        {INGREDIENTS.filter((i) => available.has(i.id)).map((ing) => (
          <button
            type="button"
            key={ing.id}
            className={selected.includes(ing.id) ? 'on' : ''}
            aria-pressed={selected.includes(ing.id)}
            aria-label={ing.name}
            title={ing.name}
            onClick={() => toggle(ing.id)}
          >
            {ing.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
