// スクショ読み取り（Tesseract.js）に必要なファイルを npm パッケージから public/ocr/ にコピーする。
// CDN に頼らずサイト自身から配信するため。大きいファイルなのでリポジトリには入れず、dev/build の前に毎回コピーする。
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const pkgDir = (name) => dirname(require.resolve(`${name}/package.json`));
const out = new URL('../public/ocr/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const files = [
  [join(pkgDir('tesseract.js'), 'dist/worker.min.js'), 'worker.min.js'],
  // LSTM 専用のエンジン。端末の対応状況に応じて Tesseract.js がどれか1つを読み込む
  ...['tesseract-core-lstm.wasm.js', 'tesseract-core-simd-lstm.wasm.js', 'tesseract-core-relaxedsimd-lstm.wasm.js'].map(
    (f) => [join(pkgDir('tesseract.js-core'), f), f],
  ),
  [join(pkgDir('@tesseract.js-data/jpn'), '4.0.0_best_int/jpn.traineddata.gz'), 'jpn.traineddata.gz'],
];
for (const [from, to] of files) copyFileSync(from, join(out, to));
console.log(`copied ${files.length} OCR files to public/ocr/`);
