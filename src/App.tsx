import { useEffect, useMemo, useState } from 'react';
import type { IngredientId } from './data/ingredients';
import { CATEGORY_LABEL, DATA_VERIFIED, RECIPES, type Category, type Recipe } from './data/recipes';
import { consume, matchRecipes, type Inventory, type RecipeResult } from './logic/match';
import { load, save } from './logic/storage';
import { IngredientGrid } from './components/IngredientGrid';
import { NumberPad } from './components/NumberPad';
import { RecipeList } from './components/RecipeList';

interface Settings {
  category: Category;
  potSize: number;
  nearLimit: number;
}

const DEFAULT_SETTINGS: Settings = { category: 'curry', potSize: 15, nearLimit: 10 };
const INVENTORY_KEY = 'pks-cooking:inventory';
const SETTINGS_KEY = 'pks-cooking:settings';

export default function App() {
  const [inventory, setInventory] = useState<Inventory>(() => load(INVENTORY_KEY, {}));
  const [settings, setSettings] = useState<Settings>(() => load(SETTINGS_KEY, DEFAULT_SETTINGS));
  const [tab, setTab] = useState<'cookable' | 'almost'>('cookable');
  const [padFor, setPadFor] = useState<IngredientId | null>(null);
  const [undo, setUndo] = useState<{ recipe: Recipe; before: Inventory } | null>(null);

  useEffect(() => save(INVENTORY_KEY, inventory), [inventory]);
  useEffect(() => save(SETTINGS_KEY, settings), [settings]);

  const { cookable, almost } = useMemo(
    () => matchRecipes(RECIPES, inventory, settings),
    [inventory, settings],
  );

  // 「あと少し」で足りない食材はタイルを強調する
  const needed = useMemo(
    () => new Set(tab === 'almost' ? almost.flatMap((r) => r.shortages.map((s) => s.id)) : []),
    [tab, almost],
  );

  const setCount = (id: IngredientId, n: number) =>
    setInventory((inv) => ({ ...inv, [id]: Math.max(0, Math.min(999, n)) }));

  const cook = (r: RecipeResult) => {
    setUndo({ recipe: r.recipe, before: inventory });
    setInventory(consume(inventory, r.recipe));
  };

  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));

  return (
    <div className="app">
      <header className="top">
        <h1>料理チェッカー</h1>
        <div className="cats" role="tablist" aria-label="今週の料理">
          {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
            <button
              type="button"
              key={c}
              role="tab"
              aria-selected={settings.category === c}
              className={settings.category === c ? 'on' : ''}
              onClick={() => update({ category: c })}
            >
              {CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
        <div className="nums">
          <label>
            鍋
            <Stepper value={settings.potSize} min={1} max={999} onChange={(v) => update({ potSize: v })} />
          </label>
          <label>
            あと少し
            <Stepper value={settings.nearLimit} min={1} max={99} onChange={(v) => update({ nearLimit: v })} />
            個
          </label>
        </div>
      </header>

      {!DATA_VERIFIED && (
        <p className="warn">
          レシピデータは暫定版です。料理名や個数がゲームと違う場合があります。
        </p>
      )}

      <section className="results">
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'cookable'} className={tab === 'cookable' ? 'on' : ''} onClick={() => setTab('cookable')}>
            作れる <span className="badge">{cookable.length}</span>
          </button>
          <button type="button" role="tab" aria-selected={tab === 'almost'} className={tab === 'almost' ? 'on' : ''} onClick={() => setTab('almost')}>
            あと少し <span className="badge">{almost.length}</span>
          </button>
        </div>
        {tab === 'cookable' ? (
          <RecipeList results={cookable} empty="今の食材で作れる料理はありません" onCook={cook} />
        ) : (
          <RecipeList results={almost} empty="あと少しで作れる料理はありません" />
        )}
      </section>

      <section className="inventory">
        <div className="inv-head">
          <h2>食材の在庫</h2>
          <button
            type="button"
            className="link"
            onClick={() => {
              if (window.confirm('在庫をすべて0にしますか？')) {
                setUndo(null);
                setInventory({});
              }
            }}
          >
            全部0にする
          </button>
        </div>
        <p className="hint">タップで+1、長押しで個数を入力</p>
        <IngredientGrid
          inventory={inventory}
          highlight={needed}
          onIncrement={(id) => setCount(id, (inventory[id] ?? 0) + 1)}
          onOpenPad={setPadFor}
        />
      </section>

      {undo && (
        <div className="toast" role="status">
          <span>{undo.recipe.name}の食材を引きました</span>
          <button
            type="button"
            onClick={() => {
              setInventory(undo.before);
              setUndo(null);
            }}
          >
            取り消す
          </button>
          <button type="button" aria-label="閉じる" onClick={() => setUndo(null)}>×</button>
        </div>
      )}

      {padFor && (
        <NumberPad
          id={padFor}
          value={inventory[padFor] ?? 0}
          onClose={() => setPadFor(null)}
          onDone={(v) => {
            setCount(padFor, v);
            setPadFor(null);
          }}
        />
      )}
    </div>
  );
}

function Stepper({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  return (
    <span className="stepper">
      <button type="button" aria-label="減らす" onClick={() => onChange(clamp(value - 1))}>−</button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
      />
      <button type="button" aria-label="増やす" onClick={() => onChange(clamp(value + 1))}>＋</button>
    </span>
  );
}
