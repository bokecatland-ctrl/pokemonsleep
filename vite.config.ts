import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// 相対パスで出力して、GitHub Pages のサブパス (/pokemonsleep/) でもそのまま動くようにする
export default defineConfig({
  base: './',
  plugins: [react()],
  test: { globals: true },
});
