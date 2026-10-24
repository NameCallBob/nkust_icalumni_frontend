import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(root, 'src');

// 本專案沿用 CRA 時代 jsconfig baseUrl=src 的「絕對路徑」寫法（import x from 'common/Axios'、'SEO'、
// 'assets/logo.png'），再加上 shadcn 慣用的 '@/' 別名。這裡把 src/ 底下每個第一層項目自動註冊成別名，
// 新增資料夾不需要再改設定。
const srcAliases = fs.readdirSync(src).flatMap((name) => {
  const base = name.replace(/\.(jsx?|json)$/, '');
  if (base.startsWith('.') || base === 'index') return [];
  return [{ find: new RegExp(`^${base}(?=/|$)`), replacement: path.join(src, base) }];
});

// https://vite.dev/config/
export default defineConfig({
  // 站台部署在網域根目錄（package.json homepage = https://nkusticalumni.org/），故 base 為 '/'。
  base: '/',
  plugins: [react()],
  resolve: {
    alias: [{ find: /^@\//, replacement: `${src}/` }, ...srcAliases],
  },
  server: {
    // 後端 CORS / CSRF_TRUSTED_ORIGINS 白名單只放行 http://localhost:3000，沿用 CRA 的埠號。
    port: 3000,
    strictPort: true,
  },
  build: {
    // 維持 CRA 的輸出資料夾，scripts/prerender.mjs、部署流程與 e2e 都不必改路徑。
    outDir: 'build',
    emptyOutDir: true,
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    css: false,
    restoreMocks: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/index.jsx',
        'src/reportWebVitals.js',
        'src/setupTests.js',
        'src/**/*.test.{js,jsx}',
        'src/**/__tests__/**',
        'src/assets/**',
      ],
      reporter: ['text-summary', 'lcov', 'html'],
      // 與 CRA 時期 package.json "jest.coverageThreshold" 相同：只針對已補測試的核心模組設門檻。
      thresholds: {
        '**/src/utils/seoHelper.js': { statements: 80, branches: 70, functions: 80, lines: 80 },
        '**/src/utils/imageDefaults.js': { statements: 80, branches: 70, functions: 80, lines: 80 },
        '**/src/hooks/useRWD.js': { statements: 70, branches: 60, functions: 60, lines: 70 },
      },
    },
  },
});
