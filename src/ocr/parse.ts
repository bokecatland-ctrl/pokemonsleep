import { INGREDIENTS, type IngredientId } from '../data/ingredients';
import type { Inventory } from '../logic/match';

// OCR が返す単語と、その位置（元画像のピクセル座標）
export interface OcrWord {
  text: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface ScanResult {
  // 読み取れた食材と個数
  found: Inventory;
  // 個数は読めたが食材名が特定できなかったセルの数（確認画面で注意を出す）
  unmatched: number;
}

// ゲームのバッグ画面は「アイコン＋右下に x13 の個数」の下に食材名が並ぶ。
// 個数を先に見つけ、その少し下にある単語のうち横位置がいちばん近い個数に割り当てて名前とする。
// 列数や画面サイズを決め打ちしないので、機種による違いに強い。

const COUNT_RE = /[xX×✕][^\d]*(\d{1,3})\s*$/;

interface Count {
  value: number;
  cx: number;
  y0: number;
  y1: number;
}

const cx = (w: OcrWord) => (w.x0 + w.x1) / 2;

function parseCount(w: OcrWord): Count | null {
  const m = COUNT_RE.exec(w.text.trim());
  return m ? { value: Number(m[1]), cx: cx(w), y0: w.y0, y1: w.y1 } : null;
}

// 食材名に使われる文字（ひらがな・カタカナ・長音・漢字）以外を捨てる
const normalize = (s: string) => s.replace(/[^぀-ヿ一-鿿]/g, '');

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}

// 読み取った文字列にいちばん近い食材名を返す。2行に折り返した名前の2行目を読み落とすことがあるので、
// 名前の先頭部分との一致も（1文字ぶん不利にして）認める。
export function matchIngredient(raw: string): IngredientId | null {
  const text = normalize(raw);
  if (text.length < 2) return null;
  const scored = INGREDIENTS.map((ing) => {
    const full = levenshtein(text, ing.name);
    const prefix = text.length < ing.name.length ? levenshtein(text, ing.name.slice(0, text.length)) + 1 : full;
    return { id: ing.id, d: Math.min(full, prefix), limit: Math.max(1, Math.floor(ing.name.length * 0.35)) };
  }).sort((a, b) => a.d - b.d);
  const [best, second] = scored;
  if (best.d > best.limit) return null;
  if (second && second.d === best.d) return null; // どちらとも取れるときは決めない
  return best.id;
}

interface NameGroup {
  text: string;
  cx: number;
  y0: number;
}

// 同じ行の単語を、間隔の空き具合でセルごとのまとまりに分ける。
// 個数の枠はセルの右寄りにあるので、単語1つずつではなく名前全体の中心で個数と対応づけるため。
function nameGroups(words: OcrWord[], h: number): NameGroup[] {
  const candidates = words.filter((w) => normalize(w.text).length > 0);
  const lines: OcrWord[][] = [];
  for (const w of [...candidates].sort((a, b) => a.y0 + a.y1 - (b.y0 + b.y1))) {
    const mid = (w.y0 + w.y1) / 2;
    const line = lines.find((l) => Math.abs((l[0].y0 + l[0].y1) / 2 - mid) < h * 0.6);
    if (line) line.push(w);
    else lines.push([w]);
  }

  const groups: NameGroup[] = [];
  for (const line of lines) {
    line.sort((a, b) => a.x0 - b.x0);
    let cur: OcrWord[] = [];
    let right = -Infinity;
    const flush = () => {
      if (cur.length === 0) return;
      const x0 = Math.min(...cur.map((w) => w.x0));
      const x1 = Math.max(...cur.map((w) => w.x1));
      groups.push({ text: cur.map((w) => w.text).join(''), cx: (x0 + x1) / 2, y0: Math.min(...cur.map((w) => w.y0)) });
      cur = [];
    };
    for (const w of line) {
      if (w.x0 - right > h * 1.2) flush();
      cur.push(w);
      right = Math.max(right, w.x1);
    }
    flush();
  }
  return groups;
}

export function parseBagScreenshot(words: OcrWord[]): ScanResult {
  const counts: Count[] = [];
  const others: OcrWord[] = [];
  for (const w of words) {
    const c = parseCount(w);
    if (c) counts.push(c);
    else others.push(w);
  }
  if (counts.length === 0) return { found: {}, unmatched: 0 };

  // 個数の枠の高さを基準に、名前を探す縦の範囲を決める（画面の解像度に依存しない）
  const heights = counts.map((c) => c.y1 - c.y0).sort((a, b) => a - b);
  const h = heights[Math.floor(heights.length / 2)];
  const reach = h * 5;

  const names = new Map<Count, string[]>(counts.map((c) => [c, []]));
  for (const group of nameGroups(others, h)) {
    // この名前より上にあり、十分近い個数の行
    const above = counts.filter((c) => c.y1 <= group.y0 + h * 0.3 && group.y0 - c.y1 <= reach);
    if (above.length === 0) continue;
    const nearestRowY = Math.max(...above.map((c) => c.y1));
    const row = above.filter((c) => nearestRowY - c.y1 < h);
    const owner = row.reduce((a, b) => (Math.abs(group.cx - a.cx) <= Math.abs(group.cx - b.cx) ? a : b));
    names.get(owner)!.push(group.text);
  }

  const found: Inventory = {};
  let unmatched = 0;
  for (const [count, ws] of names) {
    const id = matchIngredient(ws.join(''));
    if (id && found[id] === undefined) found[id] = count.value;
    else if (!id) unmatched++;
  }
  return { found, unmatched };
}

// 複数枚のスクショの結果をまとめ、写っていない食材は 0 にする。
export function mergeScans(results: ScanResult[]): ScanResult {
  const merged: Inventory = {};
  for (const ing of INGREDIENTS) merged[ing.id] = 0;
  let unmatched = 0;
  for (const r of results) {
    Object.assign(merged, r.found);
    unmatched += r.unmatched;
  }
  return { found: merged, unmatched };
}
