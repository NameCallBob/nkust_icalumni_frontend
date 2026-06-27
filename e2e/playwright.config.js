// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * NKUST iCALUMNI Playwright 主設定
 * 支援 production URL 及本地開發模式
 */

const BASE_URL = process.env.BASE_URL || 'https://aaic.nkust.edu.tw';
const API_URL = process.env.API_URL || 'https://nkust-alumni-api.binbinbob.work';

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false, // 避免 race condition on shared state
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 2,
  timeout: 30000,
  expect: {
    timeout: 10000,
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    // 中文字體支援
    locale: 'zh-TW',
    timezoneId: 'Asia/Taipei',
    // 減少測試互相影響
    storageState: undefined,
  },

  projects: [
    // ── 登入初始化（所有需要 auth 的測試依賴此 project）──
    {
      name: 'auth-setup',
      testDir: './fixtures',
      testMatch: /auth\.setup\.js/,
      use: { ...devices['Desktop Chrome'] },
    },

    // ── Desktop Chrome：主要測試平台 ──
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'fixtures/auth-state.json',
      },
      dependencies: ['auth-setup'],
      testIgnore: /auth\.setup\.js/,
    },

    // ── Firefox：跨瀏覽器相容測試 ──
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'fixtures/auth-state.json',
      },
      dependencies: ['auth-setup'],
      testIgnore: /auth\.setup\.js/,
      // Firefox 只跑 smoke + regression
      testMatch: ['**/smoke/**', '**/regression/**'],
    },

    // ── Mobile Chrome：RWD 測試 ──
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: 'fixtures/auth-state.json',
      },
      dependencies: ['auth-setup'],
      testIgnore: /auth\.setup\.js/,
      testMatch: ['**/smoke/**', '**/navigation/**', '**/crud/**', '**/buttons/**', '**/forms/**'],
    },

    // ── 無需 auth 的 Smoke Test ──
    {
      name: 'public-pages',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['**/smoke/**'],
    },

    // ── 無需 auth 的完整測試（auth/error/navigation/buttons/forms 含 mock）──
    {
      name: 'no-auth',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/crud/**', /auth\.setup\.js/],
    },
  ],

  // 本地開發：自動啟動 dev server
  // webServer: {
  //   command: 'npm start',
  //   url: 'http://localhost:3000',
  //   cwd: '../',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },
});

module.exports.BASE_URL = BASE_URL;
module.exports.API_URL = API_URL;
