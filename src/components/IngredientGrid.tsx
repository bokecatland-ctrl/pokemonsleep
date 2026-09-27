import { useRef } from 'react';
import { INGREDIENTS, type Ingredient, type IngredientId } from '../data/ingredients';
import type { Inventory } from '../logic/match';

const LONG_PRESS_MS = 450;
const MOVE_TOLERANCE = 10;

interface Props {
  inventory: Inventory;
  highlight: Set<IngredientId>;
  onIncrement: (id: IngredientId) => void;
  onOpenPad: (id: IngredientId) => void;
}

export function IngredientGrid({ inventory, highlight, onIncrement, onOpenPad }: Props) {
  return (
    <div className="grid">
      {INGREDIENTS.map((ing) => (
        <Tile
          key={ing.id}
          ingredient={ing}
          count={inventory[ing.id] ?? 0}
          highlighted={highlight.has(ing.id)}
          onTap={() => onIncrement(ing.id)}
          onLongPress={() => onOpenPad(ing.id)}
        />
      ))}
    </div>
  );
}

interface TileProps {
  ingredient: Ingredient;
  count: number;
  highlighted: boolean;
  onTap: () => void;
  onLongPress: () => void;
}

// タップで +1、長押しで数字パッド。スクロール中の指の動きはタップとみなさない。
function Tile({ ingredient, count, highlighted, onTap, onLongPress }: TileProps) {
  const timer = useRef<number | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const fired = useRef(false);

  const cancel = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
    start.current = null;
  };

  return (
    <button
      type="button"
      className={`tile${count === 0 ? ' empty' : ''}${highlighted ? ' needed' : ''}`}
      aria-label={`${ingredient.name} ${count}個。タップで1個追加、長押しで個数入力`}
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={(e) => {
        fired.current = false;
        start.current = { x: e.clientX, y: e.clientY };
        timer.current = window.setTimeout(() => {
          fired.current = true;
          timer.current = null;
          onLongPress();
        }, LONG_PRESS_MS);
      }}
      onPointerMove={(e) => {
        const s = start.current;
        if (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) > MOVE_TOLERANCE) cancel();
      }}
      onPointerUp={() => {
        const wasTap = start.current !== null && !fired.current;
        cancel();
        if (wasTap) onTap();
      }}
      onPointerCancel={cancel}
      onPointerLeave={cancel}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onLongPress();
        }
      }}
    >
      <span className="tile-icon">{ingredient.icon}</span>
      <span className="tile-count">{count}</span>
      <span className="tile-name">{ingredient.name}</span>
    </button>
  );
}
