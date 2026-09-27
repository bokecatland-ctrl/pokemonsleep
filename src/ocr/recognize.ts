import type { OcrWord } from './parse';

// Tesseract.js は数MBあるので、読み取りボタンを押したときだけ読み込む。
// エンジンと日本語データはこのサイト自身の ocr/ から配信する（scripts/copy-ocr-assets.mjs）。
export async function recognizeWords(
  images: File[],
  onProgress: (message: string) => void,
): Promise<OcrWord[][]> {
  onProgress('読み取りの準備中…');
  const { createWorker, OEM } = await import('tesseract.js');
  const base = new URL('./ocr/', document.baseURI).href;
  let current = 0;
  const worker = await createWorker('jpn', OEM.LSTM_ONLY, {
    workerPath: base + 'worker.min.js',
    corePath: base,
    langPath: base.replace(/\/$/, ''),
    logger: (m) => {
      if (m.status === 'recognizing text') {
        const label = images.length > 1 ? `${current + 1}/${images.length}枚目を` : '';
        onProgress(`${label}読み取り中… ${Math.round(m.progress * 100)}%`);
      } else if (m.status.includes('loading')) {
        onProgress('読み取りの準備中…（初回は数MBのダウンロードがあります）');
      }
    },
  });
  try {
    const results: OcrWord[][] = [];
    for (current = 0; current < images.length; current++) {
      const { data } = await worker.recognize(images[current], {}, { blocks: true });
      const words: OcrWord[] = [];
      for (const block of data.blocks ?? [])
        for (const para of block.paragraphs)
          for (const line of para.lines)
            for (const w of line.words) words.push({ text: w.text, ...w.bbox });
      results.push(words);
    }
    return results;
  } finally {
    await worker.terminate();
  }
}
