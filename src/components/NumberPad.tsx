import { useEffect, useState } from 'react';
import { INGREDIENT_BY_ID, type IngredientId } from '../data/ingredients';

interface Props {
  id: IngredientId;
  value: number;
  onDone: (value: number) => void;
  onClose: () => void;
}

export function NumberPad({ id, value, onDone, onClose }: Props) {
  const [draft, setDraft] = useState(String(value));
  const ing = INGREDIENT_BY_ID[id];
  const n = Number(draft) || 0;

  useEffect(() => setDraft(String(value)), [id, value]);

  // 長押しで開いた直後は指がまだ画面上にあり、離した瞬間のクリックがパッドのボタンに当たってしまう。
  // 開いてしばらくはクリックを無視する。
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  const set = (v: number) => setDraft(String(Math.max(0, Math.min(999, v))));
  const press = (d: string) => set(Number(draft === '0' ? d : draft + d));

  return (
    <div
      className="sheet-backdrop"
      onClick={onClose}
      onClickCapture={(e) => {
        if (!ready) e.stopPropagation();
      }}
    >
      <div className="sheet" role="dialog" aria-label={`${ing.name}の個数`} onClick={(e) => e.stopPropagation()}>
        <div className="pad-head">
          <span className="pad-icon">{ing.icon}</span>
          <span className="pad-name">{ing.name}</span>
          <span className="pad-value">{n}</span>
        </div>
        <div className="pad-steps">
          <button type="button" onClick={() => set(n - 1)}>−1</button>
          <button type="button" onClick={() => set(n + 1)}>+1</button>
          <button type="button" onClick={() => set(n + 5)}>+5</button>
          <button type="button" onClick={() => set(n + 10)}>+10</button>
        </div>
        <div className="pad-keys">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button type="button" key={d} onClick={() => press(d)}>{d}</button>
          ))}
          <button type="button" onClick={() => set(0)}>0に</button>
          <button type="button" onClick={() => press('0')}>0</button>
          <button type="button" onClick={() => set(Math.floor(n / 10))} aria-label="1文字消す">⌫</button>
        </div>
        <div className="pad-actions">
          <button type="button" className="secondary" onClick={onClose}>やめる</button>
          <button type="button" className="primary" onClick={() => onDone(n)}>決定</button>
        </div>
      </div>
    </div>
  );
}
