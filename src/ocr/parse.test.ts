import { matchIngredient, mergeScans, parseBagScreenshot, type OcrWord } from './parse';
import fixture from './__fixtures__/bag-android-1080.json';

// Android（1080x2340）のバッグ→食材画面を Tesseract.js（jpn）で読んだ結果
const words = fixture.words as OcrWord[];

describe('parseBagScreenshot', () => {
  it('実際のスクショの OCR 結果から14種の個数を読み取れる', () => {
    const { found, unmatched } = parseBagScreenshot(words);
    expect(found).toEqual({
      egg: 13,
      potato: 43,
      apple: 9,
      herb: 50,
      sausage: 49,
      milk: 49,
      honey: 20,
      oil: 6,
      ginger: 2,
      tomato: 69,
      cacao: 11,
      soybean: 19,
      corn: 6,
      coffee: 14,
    });
    expect(unmatched).toBe(0);
  });

  it('個数がなければ何も返さない', () => {
    expect(parseBagScreenshot([{ text: 'とくせんリンゴ', x0: 0, y0: 0, x1: 10, y1: 10 }]).found).toEqual({});
  });
});

describe('matchIngredient', () => {
  it.each([
    ['とくせんリンゴ', 'apple'],
    ['あまいミツウ', 'honey'], // 余計な1文字
    ['あったがジン', 'ginger'], // 2行目の読み落とし＋誤読
    ['めざましコーピー', 'coffee'],
    ['ワカクサ大豆', 'soybean'],
  ])('%s → %s', (text, id) => {
    expect(matchIngredient(text)).toBe(id);
  });

  it.each(['パッグ', '拡張する', 'もどる', 'デフォルト', 'とくせん'])('食材名でない文字列 %s は一致させない', (text) => {
    expect(matchIngredient(text)).toBeNull();
  });
});

describe('mergeScans', () => {
  it('写っていない食材は0、同じ食材は後の画像を優先', () => {
    const merged = mergeScans([
      { found: { apple: 3, egg: 1 }, unmatched: 0 },
      { found: { apple: 5 }, unmatched: 1 },
    ]).found;
    expect(merged.apple).toBe(5);
    expect(merged.egg).toBe(1);
    expect(merged.leek).toBe(0);
    expect(Object.keys(merged)).toHaveLength(19);
  });
});
