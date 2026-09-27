import { useState } from 'react';
import { INGREDIENTS, type IngredientId } from '../data/ingredients';
import type { Inventory } from '../logic/match';
import { NumberPad } from './NumberPad';

interface Props {
  scanned: Inventory;
  current: Inventory;
  unmatched: number;
  onApply: (inventory: Inventory) => void;
  onClose: () => void;
}

export function ScanReview({ scanned, current, unmatched, onApply, onClose }: Props) {
  const [draft, setDraft] = useState<Inventory>(scanned);
  const [padFor, setPadFor] = useState<IngredientId | null>(null);
  const seen = INGREDIENTS.filter((i) => (scanned[i.id] ?? 0) > 0).length;

  return (
    <div className="sheet-backdrop">
      <div className="sheet review" role="dialog" aria-label="読み取り結果の確認">
        <h2>読み取り結果（{seen}種）</h2>
        <p className="hint">
          違うところはタップして直してください。写っていない食材は0になります。
          {unmatched > 0 && <b className="short-text"> 読み取れなかった食材が{unmatched}つあります。</b>}
        </p>
        <ul className="review-list">
          {INGREDIENTS.map((ing) => {
            const value = draft[ing.id] ?? 0;
            const before = current[ing.id] ?? 0;
            return (
              <li key={ing.id}>
                <button type="button" className={value !== before ? 'changed' : ''} onClick={() => setPadFor(ing.id)}>
                  <span className="review-icon">{ing.icon}</span>
                  <span className="review-name">{ing.name}</span>
                  <span className="review-before">{value !== before ? `${before} →` : ''}</span>
                  <span className="review-value">{value}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="pad-actions">
          <button type="button" className="secondary" onClick={onClose}>やめる</button>
          <button type="button" className="primary" onClick={() => onApply(draft)}>在庫に反映</button>
        </div>
      </div>
      {padFor && (
        <NumberPad
          id={padFor}
          value={draft[padFor] ?? 0}
          onClose={() => setPadFor(null)}
          onDone={(v) => {
            setDraft((d) => ({ ...d, [padFor]: v }));
            setPadFor(null);
          }}
        />
      )}
    </div>
  );
}
