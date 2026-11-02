import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const resolvePath = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: resolvePath('./apps/demo'),
  plugins: [react()],
  resolve: {
    alias: {
      '@kit/core': resolvePath('./packages/core/src/index.ts'),
      '@kit/core-theme': resolvePath('./packages/core/src/theme/tokens.css'),
      '@kit/adapters': resolvePath('./packages/adapters/src/index.ts'),
    },
  },
  build: {
    outDir: resolvePath('./dist'),
    emptyOutDir: true,
  },
  server: {
    port: 4317,
    strictPort: true,
  },
  test: {
    root: resolvePath('.'),
    environment: 'jsdom',
    globals: true,
    setupFiles: [resolvePath('./test/setup.ts')],
    include: ['packages/*/src/**/*.test.{ts,tsx}', 'apps/*/src/**/*.test.{ts,tsx}'],
  },
});
