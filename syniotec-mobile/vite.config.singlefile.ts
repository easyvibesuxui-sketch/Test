import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Bundles the app into one self-contained HTML file — every asset, including
 * the woff2 and the exported Figma SVGs, inlined as data URIs. Used to publish
 * a shareable preview; `vite.config.ts` remains the normal build.
 */
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: 'dist-single',
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
  },
});
