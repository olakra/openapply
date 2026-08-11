import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@openapply/shared-types': path.resolve(__dirname, './packages/shared-types/index.ts'),
        '@openapply/prompt-engine': path.resolve(__dirname, './packages/prompt-engine/index.ts')
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'lcov'],
        reportsDirectory: './coverage',
        exclude: ['**/node_modules/**', '**/dist/**', '**/.vitepress/dist/**', '*.config.ts', '*.config.js']
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {}
    }
  };
});
